import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getData = async (endpoint: string) => {
  const response = await axios.get(`${BASE_URL}${endpoint}`);
  return response.data;
};
export const patchData = async (endpoint: string, data: any) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Ошибка обновления')
  return response.json()
}

// Для полной замены (если нужно)
export const putData = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Ошибка обновления')
  return response.json()
}