import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { fetchAllUsers, fetchUsersByDepartment, fetchDynamicUsers, fetchError500 } from "../../api"
import { QueryParams, Users, DisplayedUser, User, Department } from "../../types"

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

export const transformDepartment = (department: string): string => {
    const departmentMap: Record<string, string> = {
        android: "Android",
        ios: "iOS",
        design: "Designers",
        management: "Managers",
        qa: "QA",
        back_office: "Бэк-офис",
        frontend: "Frontend",
        hr: "HR",
        pr: "PR",
        backend: "Backend",
        support: "Техподдержка",
        analytics: "Analysts",
    }
    return departmentMap[department] || ""
}

export const reverseTransformDepartment = (department: string): Department => {
    const departmentMap: Record<string, Department> = {
        Android: "android",
        iOS: "ios",
        Designers: "design",
        Managers: "management",
        QA: "qa",
        "Бэк-офис": "back_office",
        Frontend: "frontend",
        HR: "hr",
        PR: "pr",
        Backend: "backend",
        Техподдержка: "support",
        Analysts: "analytics",
    }
    return departmentMap[department]
}

export const getBriefDisplayedBirthday = (dateString: string) => {
    const date = new Date(dateString)

    const day = date.getDate()

    const monthNames = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
    const month = monthNames[date.getMonth()]

    return `${day} ${month}`
}

export const getFullfDisplayedBirthday = (dateString: string) => {
    const date = new Date(dateString)

    const day = date.getDate()
    const year = date.getFullYear()

    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    const month = monthNames[date.getMonth()]

    return `${day} ${month} ${year}`
}

export const getAge = (dateString: string): string => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const birthDate = new Date(dateString)
    const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate())
    let age = currentYear - birthDate.getFullYear() - 1

    if (nextBirthday < today) {
        age += 1
    }

    let ageString = age.toString()
    const lastAgeNumber = ageString[ageString.length - 1]
    if (lastAgeNumber === "2" || lastAgeNumber === "3" || lastAgeNumber === "4") {
        ageString = ageString + " годa"
    } else if (lastAgeNumber === "1") {
        ageString = ageString + " год"
    } else {
        ageString = ageString + " лет"
    }

    return ageString
}

export const transFormPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber
        .split("")
        .map((char, i) => {
            switch (i) {
                case 1:
                    return char + " ("
                case 4:
                    return char + ") "
                case 7:
                case 9:
                    return char + " "
                default:
                    return char
            }
        })
        .join("")
}

export const { inputFilter, sortByAlphabet, sortByBirthday } = usersSlice.actions

export default usersSlice.reducer
