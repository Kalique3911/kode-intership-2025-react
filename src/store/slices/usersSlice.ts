import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { fetchAllUsers, fetchUsersByDepartment, fetchDynamicUsers, fetchError500 } from "../../api"
import { QueryParams, Users, DisplayedUser, User } from "../../types"
import { transformDepartment } from "../../utils/usersUtils"

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

const sortByBirthdayLogic = (displayedUsers: DisplayedUser[]) => {
    const today = new Date()
    const currentYear = today.getFullYear()

    const getBirthday = (birthday: string): { date: Date; days: number } => {
        const birthDate = new Date(birthday)
        const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate())

        if (nextBirthday < today) {
            nextBirthday.setFullYear(currentYear + 1)
        }

        const timeDiff = nextBirthday.getTime() - today.getTime()
        return { date: nextBirthday, days: Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) }
    }

    const currentYearUsers: DisplayedUser[] = []
    const nextYearUsers: DisplayedUser[] = []

    displayedUsers.forEach((user) => {
        const daysUntilBirthday = getBirthday(user.birthday)

        if (daysUntilBirthday.date.getFullYear() === currentYear) {
            currentYearUsers.push(user)
        } else {
            nextYearUsers.push(user)
        }
    })

    currentYearUsers.sort((a, b) => getBirthday(a.birthday).days - getBirthday(b.birthday).days)
    nextYearUsers.sort((a, b) => getBirthday(a.birthday).days - getBirthday(b.birthday).days)
    if (nextYearUsers[0]) nextYearUsers[0] = { ...nextYearUsers[0], firstNextYear: true }

    return [...currentYearUsers, ...nextYearUsers]
}

const initialState = {
    users: null as null | DisplayedUser[],
    displayedUsers: null as null | DisplayedUser[],
    sorting: "alphabet" as "alphabet" | "birthday",
    loading: false,
    error: null as string | null,
}

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        inputFilter(state, action: PayloadAction<string>) {
            if (state.users) {
                const searchQuery = action.payload.toLowerCase()
                state.displayedUsers = state.users.filter((user: DisplayedUser) => (user.firstName + " " + user.lastName).toLowerCase().includes(searchQuery) || user.userTag.toLowerCase().includes(searchQuery))
                if (state.sorting === "alphabet") {
                    state.displayedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName))
                } else {
                    state.displayedUsers = sortByBirthdayLogic(state.displayedUsers)
                }
            }
        },
        sortByAlphabet(state) {
            if (state.displayedUsers) {
                state.sorting = "alphabet"
                state.displayedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName))
                state.displayedUsers = state.displayedUsers.map((user) => ({ ...user, firstNextYear: false }))
            }
        },
        sortByBirthday(state) {
            state.sorting = "birthday"
            if (state.displayedUsers) {
                state.displayedUsers = sortByBirthdayLogic(state.displayedUsers)
            }
        },
    },
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
                    firstNextYear: false,
                }))
                state.displayedUsers = state.users
                if (state.sorting === "alphabet") {
                    state.displayedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName))
                } else {
                    state.displayedUsers = sortByBirthdayLogic(state.displayedUsers)
                }
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message as string
            })
            .addCase(fetchError.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message as string
            })
    },
})

export const { inputFilter, sortByAlphabet, sortByBirthday } = usersSlice.actions

export default usersSlice.reducer
