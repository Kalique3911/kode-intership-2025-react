import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import UserDetailsPage from "./pages/UserDetailsPage"

function App() {
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
