import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api:{},
    apiState:null,
    symbol:'',
    subBlock:{},
    isConnected: true,
    account: null,
    allAccounts: null,
    balance:0,
    projectStatus: {},
    projectFundInfo: {},
    projectName: {},
    communityName: {},
    currentBlockNum: {},
    leasePeriod: {},
    decimal:{},
  },
  mutations: {
    saveSymbol: (state, symbol) => {
      state.symbol = symbol
    },
    saveSubBlock: (state, subBlock) => {
      state.subBlock = subBlock
    },
    saveApiState: (state, apiState) => {
      state.apiState = apiState
    },
    saveApi: (state, api) => {
      state.api[state.symbol] = api
    },
    saveIsConnected: (state, isConnected) => {
      state.isConnected = isConnected
    },
    saveAccount: (state, account) => {
      state.account = account
    },
    saveAllAccounts: (state, allAccounts) => {
      state.allAccounts = allAccounts
    },
    saveBalance: (state, balance) => {
      state.balance = balance
    },
    saveProjectStatus: (state, {
      paraId,
      status
    }) => {
      if (!state.projectStatus[state.symbol]) {
        state.projectStatus[state.symbol] = {}
      }
      state.projectStatus[state.symbol][paraId] = status
      state.projectStatus = JSON.parse(JSON.stringify(state.projectStatus))
    },
    saveProjectFundInfo: (state, {
      paraId,fundInfo
    }) => {
      if (!state.projectFundInfo[state.symbol]){
        state.projectFundInfo[state.symbol] = {}
      }
      state.projectFundInfo[state.symbol][paraId] = fundInfo
      state.projectFundInfo = JSON.parse(JSON.stringify(state.projectFundInfo))
    },
    saveProjectName: (state, {
      paraId,
      name
    }) => {
      state.projectName[paraId] = name
      state.projectName = JSON.parse(JSON.stringify(state.projectName))
    },
    saveCommunityName: (state, {
      communityId,
      name
    }) => {
      state.communityName[communityId] = name
      state.communityName = JSON.parse(JSON.stringify(state.communityName))
    },
    saveCurrentBlockNum: (state, blockNum) => {
      state.currentBlockNum[state.symbol] = blockNum
      state.currentBlockNum = JSON.parse(JSON.stringify(state.currentBlockNum))
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
    getProjectStatus: state => (paraId) => {
      return state.projectStatus[state.symbol] && state.projectStatus[state.symbol][paraId]
    },
    getProjectName: state => (paraId) => {
      return state.projectName[paraId]
    },
    getCommunityName: state => (communityId) => {
      return  state.communityName[communityId]
    },
    getParaFund: state => (paraId) => {
      return state.projectFundInfo[state.symbol] && state.projectFundInfo[state.symbol][paraId]
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
