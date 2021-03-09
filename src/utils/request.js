import axios from 'axios'
import { Dialog, Toast } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
// 根据环境不同引入不同api地址
import { baseURL } from '@/config'

// create an axios instance
const service = axios.create({
  baseURL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'

service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 如果params是数组类型如arr=[1,2]，则转换成arr=1&arr=2,不转换会显示为arr[]=1&arr[]=2
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
    if (store.getters.token) {
      // let each request carry token
      config.headers['Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    const status = Number(response.status) || 200
    // console.log(response)

    if (res.code !== 0) {
      Toast({
        message: res.msg || '网络错误',
        type: 'fail',
        duration: 10 * 1000
      })

      if (status === 401 || res.code === 401 || res.code === 402) {
        // to re-login
        Dialog.confirm({
          title: '确认注销',
          message: '您的令牌丢失或者过期，您可以取消以继续停留在此页面，或重新登录',
          confirmButtonText: '重新登录',
          cancelButtonText: '取消'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // 处理blob类型
      if (response.request.responseType === 'blob') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          let data = {}
          reader.readAsText(response.data, 'utf-8')
          reader.onload = function () {
            try {
              data = JSON.parse(reader.result)
            } catch (error) {
              console.log(error)
            }
            if (data.code && data.code !== '200') {
              Toast({ message: data.msg, type: 'error' })
              reject(response)
            } else {
              resolve(response)
            }
          }
        })
      } else {
        return res
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    Toast({
      message: error.message,
      type: 'fail',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
