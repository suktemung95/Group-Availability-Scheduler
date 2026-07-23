import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiRequest from "../services/api"

const API_URL = import.meta.env.VITE_API_URL

function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
        
            setLoading(true)
            setError("")

            console.log(API_URL)
        
            const response = await apiRequest(`/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            })            

            localStorage.setItem("token", response.data)

            navigate('/dashboard')
        } catch (error) {
            console.log("Error:", error)
            setError(error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            />

            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />
            
            {error && <p>{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
        </div>
    )
}

export default LoginPage