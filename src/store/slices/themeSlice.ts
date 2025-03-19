import { createSlice } from "@reduxjs/toolkit"

export interface ThemeState {
    theme: "light" | "dark"
    mainBackground: "#FFFFFF" | "#121212"
    auxiliaryBackground: "#F7F7F8" | "#1E1E1E"
    mainFont: "#050510" | "#FFFFFF"
    auxiliaryFont: "#55555C" | "#A0A0A0"
    minorFont: "#97979B" | "#C0C0C0"
}

const getInitialThemeState = (): ThemeState => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    const theme = isDarkMode ? "dark" : "light"

    return {
        theme,
        mainBackground: isDarkMode ? "#121212" : "#FFFFFF",
        auxiliaryBackground: isDarkMode ? "#1E1E1E" : "#F7F7F8",
        mainFont: isDarkMode ? "#FFFFFF" : "#050510",
        auxiliaryFont: isDarkMode ? "#A0A0A0" : "#55555C",
        minorFont: isDarkMode ? "#C0C0C0" : "#97979B",
    }
}

const initialState: ThemeState = getInitialThemeState()

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme(state) {
            const newTheme = state.theme === "light" ? "dark" : "light"
            state.theme = newTheme

            state.mainBackground = newTheme === "dark" ? "#121212" : "#FFFFFF"
            state.auxiliaryBackground = newTheme === "dark" ? "#1E1E1E" : "#F7F7F8"
            state.mainFont = newTheme === "dark" ? "#FFFFFF" : "#050510"
            state.auxiliaryFont = newTheme === "dark" ? "#A0A0A0" : "#55555C"
            state.minorFont = newTheme === "dark" ? "#C0C0C0" : "#97979B"
        },
    },
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer
