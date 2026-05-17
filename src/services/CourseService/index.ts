import {getData} from "../api"

// Получение всех курсов
export const fetchCourses = async () => {
    const data = await getData('/courses')
    return data 
};
export const fetchCourse = async(id : string) => {
    const data = await getData(`/courses/${id}`)
    return data
}