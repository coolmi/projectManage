import Vue from 'vue';
import Vuex from 'vuex';
import ddstate from './modules/ddstate'
import loading from './modules/loading'
import item from './modules/item'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
      ddstate,
      loading,
      item
    },
    strict: debug
});
