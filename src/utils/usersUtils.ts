import i18n from "../i18n"

export const displayedDepartments = ["android", "ios", "design", "management", "qa", "back_office", "frontend", "hr", "pr", "backend", "support", "analytics"]

export const getBriefDisplayedBirthday = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()

    const monthNames = {
        ru: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
        en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    }

    const month = monthNames[i18n.language as "ru" | "en"][date.getMonth()]
    return `${day} ${month}`
}

export const getFullfDisplayedBirthday = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const year = date.getFullYear()

    const monthNames = {
        ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    }

    const month = monthNames[i18n.language as "ru" | "en"][date.getMonth()]
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

    if (i18n.language === "ru") {
        const lastAgeNumber = ageString[ageString.length - 1]
        if (lastAgeNumber === "2" || lastAgeNumber === "3" || lastAgeNumber === "4") {
            ageString = ageString + " годa"
        } else if (lastAgeNumber === "1") {
            ageString = ageString + " год"
        } else {
            ageString = ageString + " лет"
        }
    } else {
        ageString = ageString + (age === 1 ? " year" : " years")
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
