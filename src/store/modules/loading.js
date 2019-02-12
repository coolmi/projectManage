import FlowError from '@/lib/FlowError'
const state = {
  topMessage: '未知错误',
  showTopMessage: false,
  showMore: false,
  isLoading: '',
  saveFlowError: new FlowError()
}

const actions = {
  topMessage({ commit }, msg) {
    commit('TOP_MESSAGE', msg);
  },
  showTopMessage({ commit }, status) {
    commit('SHOW_TOP_MESSAGE', status);
  },
  showMore({ commit }, status) {
    commit('SHOW_MORE', status);
  },
  isLoading({ commit }, status) {
    commit('LOADING', status);
  },
  saveFlowError({ commit }, obj) {
    const { msg, action, funcName } = obj
    let ferror = new FlowError(msg, funcName, action)
    commit('TOP_MESSAGE', ferror.msg);
    commit('SAVE_FLOW_ERROR', ferror);
  }
}

const mutations = {
  'TOP_MESSAGE'(state, msg) {
    state.topMessage = msg
  },
  'SHOW_TOP_MESSAGE'(state, status) {
    state.showTopMessage = status
  },
  'SHOW_MORE'(state, status) {
    state.showMore = status
  },
  'LOADING'(state, status) {
    state.isLoading = status
  },
  'SAVE_FLOW_ERROR'(state, ferror) {
    state.saveFlowError = ferror
  }
}

export default {
  state,
  mutations,
  actions
}
