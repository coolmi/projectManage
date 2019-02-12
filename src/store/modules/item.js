const state = {
  info: null,
  queryInfo: null
}

const actions = {
  saveRcInfo({ commit }, info) {
    commit('SAVE_RC_INFO', info);
  },
  saveQueryContent({ commit }, info) {
    commit('SAVE_QUERY_CONTENT', info);
  }
}

const mutations = {
  'SAVE_RC_INFO'(state, info) {
    state.info = null
    state.info = info
  },
  'SAVE_QUERY_CONTENT'(state, info) {
    state.queryInfo = null
    state.queryInfo = info
  }
}

const getters = {
    getQueryInfo: state => state.queryInfo
}

export default {
  state,
  mutations,
  actions,
  getters
}
