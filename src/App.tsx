import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import UserDetailsPage from "./pages/UserDetailsPage"
import { RootState } from "./store/store"
import { useSelector } from "react-redux"
import { useEffect } from "react"

function App() {
    const { mainBackground } = useSelector((state: RootState) => state.theme)
    useEffect(() => {
        document.body.style.backgroundColor = mainBackground
    }, [mainBackground])

    return (
        <Router basename="/kode-intership-2025-react">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/:id" element={<UserDetailsPage />} />
            </Routes>
        </Router>
    )
}

export default App
