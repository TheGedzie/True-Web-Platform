import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Функция для получения токена
const getToken = () => localStorage.getItem('token');

// Создаем экземпляр axios с перехватчиками
const apiClient = axios.create({
  baseURL: BASE_URL,
})

// Автоматически добавляем токен в заголовки
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getData = async (endpoint: string) => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const postData = async (endpoint: string, data : any) => {
  const response = await apiClient.post(endpoint, data)
  return response.data
}

export const patchData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export const putData = async (endpoint: string, data: any) => {
  const response = await apiClient.put(endpoint, data);
  return response.data;
};