import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchAllUsers, fetchUsersByDepartment, fetchDynamicUsers, fetchError500 } from "../../api"
import { QueryParams, Users, Error, DisplayedUser, User } from "../../types"

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (params: QueryParams): Promise<Users> => {
    let response
    if (params.__example) {
        response = await fetchUsersByDepartment(params.__example)
    } else if (params.__dynamic) {
        response = await fetchDynamicUsers()
    } else {
        response = await fetchAllUsers()
    }

    return response
})

export const fetchError = createAsyncThunk("users/fetchError", async (): Promise<Error> => {
    const response = fetchError500()
    return response
})

const initialState = {
    users: null as null | DisplayedUser[],
    loading: false,
    error: null as string | null,
}

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload.items.map((user: User) => ({
                    ...user,
                    department: transformDepartment(user.department),
                }))
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

const transformDepartment = (department: string): string => {
    const departmentMap: Record<string, string> = {
        android: "Android",
        ios: "iOS",
        design: "Дизайн",
        management: "Менеджмент",
        qa: "QA",
        back_office: "Бэк-офис",
        frontend: "Frontend",
        hr: "HR",
        pr: "PR",
        backend: "Backend",
        support: "Техподдержка",
        analytics: "Аналитика",
    }
    return departmentMap[department] || ""
}

export default usersSlice.reducer
