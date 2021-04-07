import {
  ApiPromise,
  WsProvider
} from "@polkadot/api"
import {
  u8aConcat,
  u8aToHex
} from "@polkadot/util"
import {
  blake2AsU8a,
  encodeAddress
} from "@polkadot/util-crypto"
import BN from "bn.js"
import {
  POLKADOT_WEB_SOCKET,
  KUSAMA_WEB_SOCKEY,
  ROCOCO_WEB_SOCKET,
  PARA_STATUS
} from "../config"
import store from "../store"

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
    provider: wsProvider
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

export const getFundInfo = async (paraId = 200) => {
  const api = await getApi()
  paraId = parseInt(paraId)

  try {
    const unwrapedFund = (await api.query.crowdloan.funds(paraId)).unwrap();
    // console.log('fund', unwrapedFund.toHuman());
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
    const decimal = await getDecimal()
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

    const currentSlot = 10

    store.commit('saveProjectFundInfo', {
      paraId,
      fundInfo: {
        deposit: uni2Token(new BN(deposit), decimal).toString(),
        cap: uni2Token(new BN(cap), decimal).toString(),
        depositor,
        end: new BN(end),
        firstSlot: new BN(firstSlot),
        lastSlot: new BN(lastSlot),
        raised: uni2Token(new BN(raised), decimal).toString(),
        retiring,
        funds: contributions
      }
    })
    if (retiring) {
      store.commit('saveProjectStatus', {
        paraId,
        status: PARA_STATUS.RETIRED
      })
    } else {
      if (currentSlot > lastSlot) {
        store.commit('saveProjectStatus', {
          paraId,
          status: PARA_STATUS.COMPLETED
        })
      } else {
        store.commit('saveProjectStatus', {
          paraId,
          status: PARA_STATUS.ACTIVE
        })
      }
    }
  } catch (e) {
    console.error('error', e);
    // 未参与
    store.commit('saveProjectStatus', {
      paraId,
      status: PARA_STATUS.OTHER
    })
  }
}

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
  return await api.rpc.chain.subscribeNewHeads((header) => {
      try{
        const number = header.number.toNumber()
        store.commit('saveCurrentBlockNum', number)
        console.log('number', number);
      }catch (e){

      }
    }

  )
}
