import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from "vue-cookies"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: {},
    apiState: null,
    symbol: '',
    subBlock: {},
    subBalance: {},
    subFund: {},
    auctionEnd: {},
    isConnected: true,
    loadingFunds: true,
    account: Cookie.get('polkadot-account'),
    allAccounts: [],
    balance: 0,
    projectFundInfos: [],
    currentBlockNum: {},
    leasePeriod: {},
    decimal: {},
  },
  mutations: {
    saveSymbol: (state, symbol) => {
      state.symbol = symbol
    },
    saveSubBlock: (state, subBlock) => {
      state.subBlock[state.symbol] = subBlock
      state.subBlock = {
        ...state.subBlock
      }
    },
    saveSubBalance: (state, subBalance) => {
      state.subBalance = subBalance
    },
    saveSubFund: (state, subFund) => {
      state.subFund[state.symbol] = subFund
      state.subFund = {
        ...state.subFund
      }
    },
    saveAuctionEnd: (state, auctionEnd) => {
      state.auctionEnd[state.symbol] = auctionEnd
      state.auctionEnd = {...state.auctionEnd}
    },
    saveApiState: (state, apiState) => {
      state.apiState = apiState
    },
    saveLoadingFunds: (state, loadingFunds) => {
      state.loadingFunds = loadingFunds
    },
    saveApi: (state, api) => {
      state.api[state.symbol] = api
    },
    saveIsConnected: (state, isConnected) => {
      state.isConnected = isConnected
    },
    saveAccount: (state, account) => {
      state.account = account,
        Cookie.set('polkadot-account', account)
    },
    saveAllAccounts: (state, allAccounts) => {
      state.allAccounts = allAccounts
    },
    saveBalance: (state, balance) => {
      state.balance = balance
    },
    saveProjectFundInfos: (state, funds) => {
      if (!state.projectFundInfos[state.symbol]) {
        state.projectFundInfos[state.symbol] = {}
      }
      state.projectFundInfos[state.symbol] = funds
      let fundInfos = {}
      for (const key of Object.keys(state.projectFundInfos)) {
        fundInfos[key] = state.projectFundInfos[key]
      }
      state.projectFundInfos = fundInfos
      // state.projectFundInfos = JSON.parse(JSON.stringify(state.projectFundInfos))
    },
    saveCurrentBlockNum: (state, blockNum) => {
      state.currentBlockNum[state.symbol] = blockNum
      // state.currentBlockNum = JSON.parse(JSON.stringify(state.currentBlockNum))
      state.currentBlockNum = {
        ...state.currentBlockNum
      }
    },
    saveLeasePeriod: (state, leasePeriod) => {
      state.leasePeriod[state.symbol] = leasePeriod
      state.leasePeriod = JSON.parse(JSON.stringify(state.leasePeriod))
    },
    saveDecimal: (state, decimal) => {
      state.decimal[state.symbol] = decimal
      state.decimal = JSON.parse(JSON.stringify(state.decimal))
    }
  },
  getters: {
    currentLease: state => {
      const currentBlock = state.currentBlockNum[state.symbol]
      const lease = state.leasePeriod[state.symbol]
      return currentBlock.mod(lease);
    },
    getFundInfo: state => (paraId) => {
      let funds = state.projectFundInfos[state.symbol]
      funds = funds.filter(fund => fund.paraId === paraId)
      if (funds.length > 0) {
        return funds[0]
      }
      return null
    },
    getSubFund: state => () => {
      return state.subFund[state.symbol]
    },
    getSubBlock: state => () => {
      return state.subBlock[state.symbol]
    },
    getFundInfos: state => {
      return state.projectFundInfos[state.symbol]
    },
    getProjectStatus: (state, getters) => (paraId) => {
      const fund = getters.getFundInfo(paraId)
      return fund && fund.status
    },
    currentBlockNum: state => {
      return state.currentBlockNum[state.symbol]
    },
    decimal: state => {
      return state.decimal[state.symbol]
    },
  },
  actions: {},
  modules: {}
})
