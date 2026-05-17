import type { IUserExp } from "../../types";

const BASE_USER_EXP: IUserExp = {
    1: 50,
    2: 100,
    3: 125,
    4: 150,
    5: 200,
    6: 230,
    7: 280,
    8: 300,
    9: 350
}

// Функция расчета опыта и уровня ползователя 
export const calculateNewLevel = (currentLevel: number, currentXP: number) => {
    let newLevel = currentLevel
    let remainingXP = currentXP
    
    while (remainingXP >= BASE_USER_EXP[newLevel] && BASE_USER_EXP[newLevel]) {
        remainingXP -= BASE_USER_EXP[newLevel]
        newLevel++
    }
    
    // Сколько XP нужно до следующего уровня
    const xpToNextLevel = BASE_USER_EXP[newLevel] - remainingXP
    
    return { 
        level: newLevel, 
        totalXP: remainingXP,
        xpToNextLevel,
        xpRequiredForNextLevel: BASE_USER_EXP[newLevel]
    }
}