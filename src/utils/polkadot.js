import {
  ApiPromise,
  WsProvider
} from "@polkadot/api"
import {
  u8aConcat,
  u8aToHex,
  numberToU8a,
} from "@polkadot/util"
import {
  web3Accounts,
  web3Enable,
  web3FromSource
} from '@polkadot/extension-dapp'
import keyring from '@polkadot/ui-keyring';

import {
  blake2AsU8a,
  encodeAddress,
  decodeAddress,
  cryptoWaitReady
} from "@polkadot/util-crypto"
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import BN from "bn.js"
import {
  POLKADOT_WEB_SOCKET,
  KUSAMA_WEB_SOCKEY,
  ROCOCO_WEB_SOCKET,
  PARA_STATUS,
  CHAIN_ID
} from "../config"
import store from "../store"
import {
  API_CONNECT_STATE
} from '../constant'
const POLKADOT_CHAIN_WEB_SOCKET_MAP = {
  'POLKADOT': POLKADOT_WEB_SOCKET,
  'KUSAMA': KUSAMA_WEB_SOCKEY,
  'ROCOCO': ROCOCO_WEB_SOCKET
}

let _api = {}

async function getApi() {
  if (_api && _api[store.state.symbol]) {
    console.log('has api');
    return _api[store.state.symbol]
  }
  const wsProvider = new WsProvider(POLKADOT_CHAIN_WEB_SOCKET_MAP[store.state.symbol])
  const api = await ApiPromise.create({
    provider: wsProvider,
    rpc: jsonrpc,
    types: {
      PalletId: 'Raw'
    }
  })
  _api[store.state.symbol] = api
  return api
}

function uni2Token(uni, decimal) {
  return uni.div(new BN(10).pow(decimal))
}

function createChildKey(trieIndex) {
  return u8aToHex(
    u8aConcat(
      ':child_storage:default:',
      blake2AsU8a(
        u8aConcat('crowdloan', trieIndex.toU8a())
      )
    )
  );
}

export const getFundInfo = async (paraId = [200]) => {
  const api = await getApi()
  paraId = paraId.map(p => parseInt(p))
  try {
    store.commit('saveLoadingFunds', true)
    const unwrapedFunds = (await api.query.crowdloan.funds.multi(paraId));
    // console.log('fund', unwrapedFunds);
    const bestBlockNumber = (await api.derive.chain.bestNumber()).toNumber()
    const decimal = await getDecimal()
    let funds = []
    for (let i = 0; i < unwrapedFunds.length; i++) {
      const fund = unwrapedFunds[i]
      const pId = paraId[i]
      if (!fund) {
        continue
      }
      const unwrapedFund = fund.unwrap()
      // console.log('unwrapedFund', unwrapedFund);
      const {
        deposit,
        cap,
        depositor,
        end,
        firstSlot,
        lastSlot,
        raised,
        retiring,
        trieIndex
      } = unwrapedFund
      const childKey = createChildKey(trieIndex)
      const keys = await api.rpc.childstate.getKeys(childKey, '0x')
      const ss58keys = keys.map(k => encodeAddress(k))
      const values = await Promise.all(keys.map(k => api.rpc.childstate.getStorage(childKey, k)))
      const contributions = values.map((v, idx) => ({
        contributor: ss58keys[idx],
        amount: uni2Token(new BN(api.createType('(Balance, Vec<u8>)', v.unwrap())[0]), decimal).toString(),
        memo: api.createType('(Balance, Vec<u8>)', v.unwrap())[1].toHuman()
      }))
      // console.log('contri', contributions);
      const leasePeriod = await getLeasePeriod()
      const currentPeriod = Math.floor(bestBlockNumber / leasePeriod)
      const leases = (await api.query.slots.leases(pId)).toJSON()
      const isWinner = leases.length > 0
      const isCapped = raised >= cap
      const isEnded = bestBlockNumber > end

      let status = ''
      let statusIndex = 0
      if (retiring.toHuman()) {
        status = PARA_STATUS.RETIRED
        statusIndex = 1
      } else {
        if (!(isCapped || isEnded || isWinner) && currentPeriod <= firstSlot) {
          status = PARA_STATUS.ACTIVE
          statusIndex = 0
        } else {
          status = PARA_STATUS.COMPLETED
          statusIndex = 2
        }
      }
      funds.push({
        paraId: pId,
        status,
        statusIndex,
        deposit: uni2Token(new BN(deposit), decimal).toString(),
        cap: uni2Token(new BN(cap), decimal).toString(),
        depositor,
        end: new BN(end),
        firstSlot: new BN(firstSlot),
        lastSlot: new BN(lastSlot),
        raised: uni2Token(new BN(raised), decimal).toString(),
        retiring,
        trieIndex,
        funds: contributions
      })
    }
    funds = funds.sort(f => f.statusIndex)
    console.log('funds', funds);
    store.commit('saveProjectFundInfos', funds)
  } catch (e) {
    console.error('error', e);
  } finally {
    store.commit('saveLoadingFunds', false)
  }
}

//  一个租赁周期
export const getLeasePeriod = async () => {
  if (store.getters.leasePeriod > 0) {
    return store.getters.leasePeriod
  }
  const api = await getApi()
  const leasePeriod = new BN(api.consts.slots.leasePeriod)
  store.commit('saveLeasePeriod', leasePeriod)
  return leasePeriod
}

export const getDecimal = async () => {
  if (store.getters.decimal > 0) {
    return store.getters.decimal
  }
  const api = await getApi()
  const decimal = new BN(api.registry.chainDecimals[0]);
  store.commit('saveDecimal', decimal)
  return decimal
}

// subscribe new block
export const subBlock = async () => {
  const api = await getApi()
  let subBlock = store.state.subBlock
  try {
    //   cancel last subscribe
    subBlock()
  } catch (e) {}
  // console.log('sub block');
  subBlock = await api.rpc.chain.subscribeNewHeads((header) => {
    try {
      const number = header.number.toNumber()
      console.log('number', number);
      store.commit('saveCurrentBlockNum', number)
    } catch (e) {

    }
  })
  store.commit('saveSubBlock', subBlock)
}


export const connect = (callback) => {
  if (store.state.apiState) {
    if (callback) callback();
    return;
  }
  store.commit('saveApiState', API_CONNECT_STATE.CONNECT_INIT)
  console.log('network', POLKADOT_CHAIN_WEB_SOCKET_MAP[store.state.symbol]);
  const wsProvider = new WsProvider(POLKADOT_CHAIN_WEB_SOCKET_MAP[store.state.symbol])
  const api = new ApiPromise({
    provider: wsProvider,
    rpc: jsonrpc,
    types: {
      PalletId: 'Raw'
    }
  })

  api.on('connected', () => {
    store.commit('saveApiState', API_CONNECT_STATE.CONNECT)
    console.log('connecting');
    api.isReady.then(() => {
      store.commit('saveApiState', API_CONNECT_STATE.CONNECT_SUCCESS)
    })
  })

  api.on('ready', async () => {
    store.commit('saveApiState', API_CONNECT_STATE.CONNECT_SUCCESS)
    console.log('connected');
    await loadAccounts()
  })

  api.on('error', err => {
    console.error('Connect error');
    store.commit('saveApiState', API_CONNECT_STATE.CONNECT_ERROR)
  })
}
export const loadAccounts = async () => {
  try {
    await web3Enable('crowdloan')
    let allAccounts = await web3Accounts()
    await cryptoWaitReady();
    keyring.loadAll({
      isDevelopment: true
    }, allAccounts)
    console.log('accs:', allAccounts);
    account = allAccounts.map(a => ({
      ...a
    }))
    store.commit('saveAllAccounts', allAccounts)
    let account = store.state.account || allAccounts[0]
    store.commit('saveAccount', account)
    getBalance(account)
    // inject
    await injectAccount(account)
  } catch (e) {
    console.error('get all accounts fail:', e);
  }
}

export const injectAccount = async (account) => {
  const injected = await web3FromSource(account.meta.source)
  const api = await getApi()
  api.setSigner(injected.signer)
  return api
}

export const getBalance = async (account) => {
  const api = await getApi()
  const {
    nonce,
    data: balance
  } = await api.query.system.account(account.address)
  const decimal = await getDecimal()
  const res = uni2Token(new BN(balance.free), decimal)
  store.commit('saveBalance', res.toNumber())
  return res.toNumber()
}

export function getNodeId(address) {
  return decodeAddress(address).slice(0, 8);
}

function NumberTo4BytesU8A(number) {
  let buf = new Uint8Array(4);
  let tmp = numberToU8a(number);
  if (tmp.length > 4) throw new Error('Unsupported size of number');
  for (let i = tmp.length; i > 0; i--) {
    buf[4 - i] = tmp[i - 1];
  }
  return buf;
}

/** memo {
 *     chain: u8,           // 1 bytes chain id
 *     parent: vec<u8, 8>,  // 8 bytes parent node id
 *     child: vec<u8, 8>,   // 8 bytes child node id
 *     height: u32,         // 4 bytes block height of contribute Tx
 *     paraId: u32,         // 4 bytes parachain id
 *     trieIndex: u32,      // 4 bytes of crowdloan fund trie index
 *  }
 */
export function encodeMemo(memo) {
  let buf = new Uint8Array(29);
  buf[0] = memo.chain;
  buf.set(memo.parent, 1);
  buf.set(memo.child, 9);
  buf.set(NumberTo4BytesU8A(memo.height), 17);
  buf.set(NumberTo4BytesU8A(memo.paraId), 21);
  buf.set(NumberTo4BytesU8A(memo.trieIndex), 25);
  return '0x' + Buffer.from(buf).toString('hex');
}

export const withdraw = async (paraId) => {
  const api = await getApi()
  return new Promise(async (resolve, reject) => {
    const from = store.state.account && store.state.account.address
    if (!from) {
      reject('no account')
    }
    const nonce = (await api.query.system.account(from)).nonce.toNumber()
    const unsub = await api.tx.crowdloan.withdraw(from, paraId).signAndSend(from, {
      nonce
    }, (result) => {
      if (result.status.isInBlock) {
        console.log("Transaction included at blockHash ", result.status.asInBlock);
      } else if (result.status.isFinalized) {
        unsub()
        resolve(result.status.asFinalized)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}


export const contribute = async (paraId, amount, communityId, childId, trieIndex) => {
  return new Promise(async (resolve, reject) => {
    const from = store.state.account && store.state.account.address
    if (!from) {
      reject('no account')
    }
    const api = await injectAccount(store.state.account)
    const decimal = await getDecimal()
    paraId = api.createType('Compact<u32>', paraId)
    amount = api.createType('Compact<BalanceOf>', new BN(amount).mul(new BN(10).pow(decimal)))
    const nonce = (await api.query.system.account(from)).nonce.toNumber()
    console.log('amount', amount.toNumber());
    const unsub = await api.tx.crowdloan.contribute(paraId, amount, null).signAndSend(from, {
      nonce
    }, (result) => {
      if (result.status.isInBlock) {
        console.log("Transaction included at blockHash ", result.status.asInBlock.toJSON());
      } else if (result.status.isFinalized) {
        console.log('contribute result:', result.toJSON());
        unsub()
        resolve(result.status.asFinalized)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

export const addMemo = async (memo) => {

}
