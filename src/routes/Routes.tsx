import { BrowserRouter, Route, Routes } from "react-router-dom"
import Register from "../pages/auth/Register"
import Login from "../pages/auth/Login"
import UserTable from "../pages/userTable"



const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user_table" element={<UserTable />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      
      </Routes>
    </BrowserRouter>
  )
}

export default MainRoutes