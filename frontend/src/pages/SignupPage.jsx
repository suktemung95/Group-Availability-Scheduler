import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import apiRequest from "../services/api"
import "./SignupPage.css"

function SignupPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

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

    setError("")

    const trimmedUsername = username.trim()

    if (!trimmedUsername) {
      setError("Please enter a username.")
      return
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: trimmedUsername,
          password,
        }),
      })

      /*
        This supports a registration response that directly
        returns a JWT in response.data.
      */
      const token = response?.data

      if (token) {
        localStorage.setItem("token", token)
        navigate("/dashboard")
        return
      }

      /*
        If registration succeeds without returning a token,
        send the user to the login page.
      */
      navigate("/login", {
        state: {
          message: "Account created successfully. Please log in.",
        },
      })
    } catch (signupError) {
      console.error("Signup error:", signupError)

      setError(
        signupError.message ||
          "Unable to create your account. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const formIsValid =
    username.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length > 0 &&
    password === confirmPassword

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="signup-brand">
          <div className="signup-brand-icon">G</div>

          <div>
            <p className="signup-eyebrow">GroupAvail</p>
            <h1>Create an account</h1>
          </div>
        </div>

        <p className="signup-description">
          Create your account to manage schedules, join groups,
          receive invitations, and compare shared availability.
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-field">
            <span>Username</span>

            <input
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
                setError("")
              }}
              placeholder="Choose a username"
              autoComplete="username"
              disabled={loading}
              required
            />
          </label>

          <label className="signup-field">
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError("")
              }}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
              minLength="6"
              required
            />

            <small>
              Use at least 6 characters.
            </small>
          </label>

          <label className="signup-field">
            <span>Confirm Password</span>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setError("")
              }}
              placeholder="Enter your password again"
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </label>

          {confirmPassword &&
            password !== confirmPassword &&
            !error && (
              <p className="signup-validation-message">
                Passwords do not match.
              </p>
            )}

          {error && (
            <p className="signup-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="signup-submit-button"
            disabled={loading || !formIsValid}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="signup-divider">
          <span>Already have an account?</span>
        </div>

        <button
          type="button"
          className="signup-login-button"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Return to login
        </button>
      </section>
    </main>
  )
}

export default SignupPage