import { getData, patchData, postData } from "../api";
import { calculateNewLevel } from "../../utils/userXpUtils";

// Получение текущего пользователя (по токену)
export const fetchCurrentUser = async () => {
  const data = await getData("/users/me");
  return data;
};

// Получение пользователя по ID
export const fetchUserById = async (id: string) => {
  const data = await getData(`/users/${id}`);
  return data;
};

// Обновление текущего пользователя
export const patchCurrentUser = async (content: any) => {
  const data = await patchData("/users/me", content);
  return data;
};

// Обновление пользователя по ID
export const patchUserById = async (id: string, content: any) => {
  const data = await patchData(`/users/${id}`, content);
  return data;
};

export const registerUser = async (content: any) => {
  const data = await postData("/auth/register", content);
  return data;
};

export const loginUser = async (content: any) => {
  const data = await postData("/auth/login", content);
  return data;
};

// ⚠️ ОБНОВЛЕНИЕ УРОВНЯ — ТОЛЬКО УРОВЕНЬ, НЕ totalXP!
export const updateUserLevel = async (user: any) => {
  const { level: newLevel } = calculateNewLevel(user.level, user.totalXP);

  if (newLevel !== user.level) {
    const updatedUser = await patchCurrentUser({ level: newLevel });
    return updatedUser;
  }

  return user;
};

// Для обратной совместимости
export const fetchUser = fetchCurrentUser;
export const patchUser = patchCurrentUser;
