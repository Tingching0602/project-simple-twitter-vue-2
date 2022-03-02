import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: {
      id: -1,
      name: "",
      email: "",
      image: "",
      isAdmin: false,
    },
    isAuthenticated: false,
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        // 將 API 取得的 currentUser 覆蓋掉 Vuex state 中的 currentUser
        ...currentUser,
      };
      // 將使用者的登入狀態改為 true
      state.isAuthenticated = true;
    },
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
      sessionStorage.removeItem('room')
    },
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const { data } = await userAPI.getCurrentUser()
        if (data.status === 'error') {
          throw new Error(data.message)
        }
        const { account, id, name, email, avatar, role } = data
        commit('setCurrentUser', {
          account, id, name, email, avatar, role
        })
      //signin success
      return true
      } catch(error) {
        //驗證失敗會觸發登出來清除token
        commit('revokeAuthentication')
        console.loge(error.message)
        return false
      }
    }
  },
  modules: {},
});
