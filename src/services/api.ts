import axios from "axios";

export const getData = async (URL: string) => {
    try {
        const response = await axios.get(URL)
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}