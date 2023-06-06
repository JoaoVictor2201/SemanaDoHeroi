import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface IRefreshConfig extends AxiosRequestConfig {
  onFailure?: (error: AxiosError) => void
  onSuccess?: (response: AxiosResponse) => void
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

const refreshSubscriber: Array<(token: string) => void> = []
let failedRequest: Array<IRefreshConfig> = []

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token:semana-heroi')

  if(token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response, 
  async (error: AxiosError | unknown) => {
    const originalRequest = (error as AxiosError).config as IRefreshConfig
    if(error instanceof AxiosError && error.response?.status === 401) {
      if(error.response?.data && error.response?.data.code === 'token expired') {

        try {
          const refreshToken = localStorage.getItem('refresh_token:semana-heroi')
          const response = await api.post('/refresh', {
            refresh_token: refreshToken,
          });
  
          const {token, refresh_token} = response.data;
          localStorage.setItem('token:semana-heroi', token)
          localStorage.setItem('refresh_token:semana-heroi', refresh_token)
  
          onRefreshed(token);
  
          if(originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return axios(originalRequest)
        } catch (error) {
          failedRequest.forEach((request) => {
            request.onFailure?.(error as AxiosError)
          });
          failedRequest = []
        }
      } 
    } else {
      localStorage.removeItem('token:semana-heroi')
      localStorage.removeItem('refresh_token:semana-heroi')
      localStorage.removeItem('user:semana-heroi')
    }
    return Promise.reject(error);
  }
)

function onRefreshed(token: string) {
  refreshSubscriber.forEach((callback) => callback(token))
}

export { api }