import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getStore } from '@/utils/store'

const state = {
  token: getToken(),
  info: getStore({ name: 'info' }) || {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(async response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info 用户roles权限列表，用户名，头像
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token)
        .then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { info } = data
          // roles must be a non-empty array
          commit('SET_INFO', info)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', {})
    removeToken()
  },

  // remove token
  resetToken({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_INFO', {})
    removeToken()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
