import { Routes, Route } from "react-router-dom"
import { Login } from "../page/Login"
import { Register } from "../page/Register"

export const RouteApp = () => {
  return (
    <Routes>

      <Route 
        path='/'
        element={
          <Login></Login>
        }
      />

      <Route 
        path='/register'
        element={
          <Register></Register>
        }
      />

    </Routes>
  )
}