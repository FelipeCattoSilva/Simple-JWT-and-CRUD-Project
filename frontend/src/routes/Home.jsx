import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Welcome to the Home Page!</h2>
        <p className="text-gray-700 mb-4">Please login or register to continue.</p>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="w-full mt-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Register
        </button>
      </div>
    </div>
  )
}

export default Home