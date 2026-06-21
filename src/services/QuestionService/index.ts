import {getData, patchData, postData} from '../api'

export const fetchQuestions = async() => {
    const data = await getData('/questions')
    return data
}
export const fetchQuestion = async(id : string) => {
    const data = await getData(`/questions/${id}`)
    return data
}
export const patchQuestion = async(id : string, content : any) => {
    const data = await patchData(`/questions/${id}`, content)
    return data
}
export const postQuestion = async(content : any) => {
    const data = await postData('/questions/create', content)
    return data 
}