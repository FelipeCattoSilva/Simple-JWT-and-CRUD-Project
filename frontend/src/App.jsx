import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./routes/Dashboard"
import Register from "./routes/Register"
import Login from "./routes/Login"
import Home from "./routes/Home"
import Error from "./routes/Error"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="*" element={<Error/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
