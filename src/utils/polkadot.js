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
  ROCOCO_WEB_SOCKET
} from "../config"


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

export const getFund = async () => {
    console.log(ROCOCO_WEB_SOCKET);
  const wsProvider = new WsProvider(ROCOCO_WEB_SOCKET)
  const api = await ApiPromise.create({
    provider: wsProvider
  })
  const paraId = parseInt(30)

  const fund = await api.query.crowdloan.funds(paraId);
  console.log(888, fund);
  const trieIndex = fund.unwrap().trieIndex;
  const childKey = createChildKey(trieIndex);

  console.log(1234, fund, trieIndex, childKey);
}
