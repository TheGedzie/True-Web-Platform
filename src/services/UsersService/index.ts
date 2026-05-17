import {getData, patchData} from "../api"
import { calculateNewLevel } from "../../utils/userXpUtils"

// Получение всех пользователей
export const fetchUser = async() => {
  const data = await getData('/users/1')
  return data
}
// Обновление пользователя 
export const patchUser = async(content : any) =>{
  const data = await patchData("/users/1", content)
  return data
}

// Обновление уровня пользователя 
export const updateUserLevel = async (user: any) => {
    const { level: newLevel, totalXP: newXP } = calculateNewLevel(user.level, user.totalXP)
    
    if (newLevel !== user.level) {
        const updatedUser = await patchUser({ level: newLevel, totalXP: newXP })
        return updatedUser
    }
    
    return user
}