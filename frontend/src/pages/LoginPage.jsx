import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import apiRequest from "../services/api"
import "./LoginPage.css"

function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      navigate("/dashboard")
    }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setError("")

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const token = response?.data

      if (!token) {
        throw new Error(
          "Login succeeded, but no authentication token was returned"
        )
      }

      localStorage.setItem("token", token)
      navigate("/dashboard")
    } catch (loginError) {
      console.error("Login error:", loginError)

      setError(
        loginError.message ||
          "Unable to log in. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">G</div>

          <div>
            <p className="login-eyebrow">GroupAvail</p>
            <h1>Welcome back</h1>
          </div>
        </div>

        <p className="login-description">
          Log in to manage your schedule, groups, invitations,
          and shared availability.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Username</span>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter your username"
              autoComplete="username"
              disabled={loading}
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </label>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit-button"
            disabled={
              loading ||
              !username.trim() ||
              !password
            }
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="login-divider">
          <span>New to GroupAvail?</span>
        </div>

        <button
          type="button"
          className="login-signup-button"
          onClick={() => navigate("/signup")}
          disabled={loading}
        >
          Create an account
        </button>
      </section>
    </main>
  )
}

export default LoginPage