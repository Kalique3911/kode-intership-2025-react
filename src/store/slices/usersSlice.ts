import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { fetchAllUsers, fetchUsersByDepartment, fetchDynamicUsers, fetchError500 } from "../../api"
import { QueryParams, Users, DisplayedUser, User, Department } from "../../types"

type CacheEntry = {
    data: User[]
    timestamp: number
}

interface UsersState {
    users: null | DisplayedUser[]
    displayedUsers: null | DisplayedUser[]
    sorting: "alphabet" | "birthday"
    loading: boolean
    error: string | null
    searchQuery: string | null
    selectedDepartment: Department | undefined
    cache: Record<string, CacheEntry>
}

const initialState: UsersState = {
    users: null,
    displayedUsers: null,
    sorting: "alphabet",
    loading: false,
    error: null,
    searchQuery: null,
    selectedDepartment: undefined,
    cache: {},
}

const CACHE_DURATION = 5 * 60 * 1000

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (params: QueryParams, { getState }): Promise<Users> => {
    const state = getState() as { users: UsersState }
    const cacheKey = params.__example || "all"

    if (state.users.cache && state.users.cache[cacheKey] && Date.now() - state.users.cache[cacheKey].timestamp < CACHE_DURATION) {
        return { items: state.users.cache[cacheKey].data }
    }

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
        setSearchQuery(state, action) {
            state.searchQuery = action.payload
        },
        setSelectedDepartment(state, action) {
            state.selectedDepartment = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                const cacheKey = state.selectedDepartment || "all"
                state.cache[cacheKey] = { data: action.payload.items, timestamp: Date.now() }
                state.users = action.payload.items.map((user: User) => ({
                    ...user,
                    firstNextYear: false,
                }))

                if (state.searchQuery) {
                    state.displayedUsers = state.users.filter(
                        (user: DisplayedUser) => (user.firstName + " " + user.lastName).toLowerCase().includes(state.searchQuery!.toLowerCase()) || user.userTag.toLowerCase().includes(state.searchQuery!.toLowerCase())
                    )
                } else {
                    state.displayedUsers = state.users
                }

                if (state.sorting === "alphabet") {
                    state.displayedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName))
                } else {
                    state.displayedUsers = sortByBirthdayLogic(state.displayedUsers)
                }
                state.loading = false
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

export const { inputFilter, sortByAlphabet, sortByBirthday, setSearchQuery, setSelectedDepartment } = usersSlice.actions

export default usersSlice.reducer
