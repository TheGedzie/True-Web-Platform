import { getData } from "../api";

export const fetchChellenges = async() => {
    const data = await getData('/chellenges')
    return data
}
export const fetchChellenge = async(id : string) => {
    const data = await getData(`/chellenges/${id}`)
    return data
}