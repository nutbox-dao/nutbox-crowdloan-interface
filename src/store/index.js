import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isConnected: false,
    account: "salfdjoji",
    projectStatus: {},
    projectName: {},
    communityName: {},

  },
  mutations: {
    saveIsConnected: (state, isConnected) => {
      state.isConnected = isConnected
    },
    saveAccount: (state, account) => {
      state.account = account
    },
    saveProjectStatus: (state, {
      chainId,
      project,
      status
    }) => {
      if (!state.projectStatus[chainId]) {
        state.projectStatus[chainId] = {}
      }
      state.projectStatus[chainId][project] = status
    },
    saveProjectName: (state, {
      projectId,
      name
    }) => {
      state.projectName[projectId] = name
    },
    saveCommunityName: (state, {
      communityId,
      name
    }) => {
      state.communityName[communityId] = name
    }
  },
  actions: {},
  modules: {}
})
