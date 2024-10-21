import axios from 'axios'
const authInstance = axios.create({
  baseURL: 'http://127.0.0.1:8080/',
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8;'
  }
})

const publicInstance = axios.create({
  baseURL: 'http://127.0.0.1:8080/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8;'
  }
})

authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

authInstance.interceptors.response.use(
  (response) => response.data,
  (err) => {
    return Promise.reject(err)
  }
)

publicInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
export { authInstance, publicInstance }
