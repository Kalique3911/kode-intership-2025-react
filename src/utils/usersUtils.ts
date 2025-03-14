import { Department } from "../types"

export const displayedDepartments = ["Android", "iOS", "Designers", "Managers", "QA", "Бэк-офис", "Frontend", "HR", "PR", "Backend", "Техподдержка", "Analysts"]

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
