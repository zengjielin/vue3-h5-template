import { getStore, removeStore, setStore } from '@/utils/store'

const TokenKey = 'token'

export function getToken() {
  return getStore({ name: TokenKey })
}

export function setToken(token) {
  return setStore({ name: TokenKey, content: token })
}

export function removeToken() {
  return removeStore({ name: TokenKey })
}
