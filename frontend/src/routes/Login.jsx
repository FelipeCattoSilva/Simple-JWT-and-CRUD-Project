import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = "http://localhost:8000"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      })
      const token = response.data.token
      if (token) {
        localStorage.setItem("token", token)
        setMessage(response.data.message)
        setTimeout(() => navigate("/dashboard"), 1000)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please try again."
      setMessage(errorMsg)
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {message && (
          <p className="text-center mb-4 text-sm text-red-600">{message}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
