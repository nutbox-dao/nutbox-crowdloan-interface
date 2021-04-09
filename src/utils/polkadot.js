import {
  ApiPromise,
  WsProvider
} from "@polkadot/api"
import {
  u8aConcat,
  u8aToHex,
  BN_MAX_INTEGER,
  isChildClass,
  numberToU8a,
  hexToU8a
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
import {
  Keyring
} from "@polkadot/keyring"
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import BN from "bn.js"
import {
  POLKADOT_WEB_SOCKET,
  KUSAMA_WEB_SOCKEY,
  ROCOCO_WEB_SOCKET,
  PARA_STATUS
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

async function getApi() {
  if (store.state.api[store.state.symbol]) {
    return store.state.api[store.state.symbol]
  }
  const wsProvider = new WsProvider(POLKADOT_CHAIN_WEB_SOCKET_MAP[store.state.symbol])
  const api = await ApiPromise.create({
    provider: wsProvider,
    rpc: jsonrpc
  })
  store.commit('saveApi', api)
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

  try {
    const unwrapedFunds = (await api.query.crowdloan.funds.multi(paraId));
    console.log('fund', unwrapedFunds);
    const bestBlockNumber = (await api.derive.chain.bestNumber()).toNumber()
    const decimal = await getDecimal()
    let funds = []
    for (let unwrapedFund of unwrapedFunds) {
      unwrapedFund = unwrapedFund.toHuman()
      if (!unwrapedFund){
        continue
      }
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
      const leases = (await api.query.slots.leases(paraId)).toJSON()
      const isWinner = leases.length > 0

      let status = ''
      let statusIndex = 0
      if (retiring) {
        if (bestBlockNumber > end) {
          status = PARA_STATUS.COMPLETED
          statusIndex = 2
        } else {
          status = PARA_STATUS.RETIRED
          statusIndex = 1
        }
      } else {
        if (bestBlockNumber > end) {
          if (isWinner) {
            status = PARA_STATUS.ACTIVE
            statusIndex = 0
          } else {
            status = PARA_STATUS.COMPLETED
            statusIndex = 1
          }
        } else {
          status = PARA_STATUS.ACTIVE
          statusIndex = 0
        }
      }
      funds.push({
        paraId,
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
        funds: contributions
      })
    }
    funds = funds.sort(f => f.statusIndex)
    store.commit('saveProjectFundInfos', funds)
  } catch (e) {
    console.error('error', e);
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
  subBlock = await api.rpc.chain.subscribeNewHeads((header) => {
    try {
      const number = header.number.toNumber()
      store.commit('saveCurrentBlockNum', number)
      console.log('number', number);
    } catch (e) {

    }
  })
  store.commit('saveSubBlock', subBlock)
}


export const connect = (callback) => {
  if (store.state.apiState) return;
  store.commit('saveApiState', API_CONNECT_STATE.CONNECT_INIT)

  const api = getApi()
  api.on('connected', () => {
    store.commit('saveApiState', API_CONNECT_STATE.CONNECT)
    api.isReady.then(() => {
      store.commit('saveApiState', API_CONNECT_STATE.CONNECT_SUCCESS)
    })
  })

  api.on('ready', () => {
    store.commit('saveApiState', API_CONNECT_STATE.CONNECT_SUCCESS)
    if (callback) callback();
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
    allAccounts = allAccounts.map(({
      address,
      meta
    }) => ({
      address,
      meta: {
        ...meta,
        name: `${meta.name} (${meta.source})`
      }
    }))

    store.commit('')

    keyring.loadAll({
      idDevelopment: true
    }, allAccounts)

    const account = store.state.account || allAccounts[0]
    store.commit('saveAccount', account)
    // inject

  } catch (e) {

  }
}

export const injectAccount = async (account) => {
  const injected = await web3FromSource(account.meta.source)
  const api = await getApi()
  api.setSigner(injected.signer)
  return api
}

export const getBalance = async (account) => {
  const api = getApi()
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