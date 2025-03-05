import axios from "axios"
import { Department, Users, Error } from "../../types"

const API_URL = "https://stoplight.io/mocks/kode-frontend-team/koder-stoplight/86566464/users"

export const fetchAllUsers = async (): Promise<Users> => {
    try {
        const response = await axios.get(`${API_URL}?__example=all`)
        return response.data
    } catch (error) {
        console.error("Error fetching all users:", error)
        throw error
    }
}

export const fetchUsersByDepartment = async (department: Department): Promise<Users> => {
    try {
        const response = await axios.get(`${API_URL}?__example=${department}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching users from ${department}:`, error)
        throw error
    }
}

export const fetchDynamicUsers = async (): Promise<Users> => {
    try {
        const response = await axios.get(`${API_URL}?__dynamic=true`)
        return response.data
    } catch (error) {
        console.error("Error fetching dynamic users:", error)
        throw error
    }
}

export const fetchError500 = async (): Promise<Error> => {
    try {
        const response = await axios.get(`${API_URL}?__code=500&__dynamic=true`)
        return response.data
    } catch (error) {
        console.error("Error fetching 500 error:", error)
        throw error
    }
}
