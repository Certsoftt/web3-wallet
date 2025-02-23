import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

type RequireAuthProps = {
    children: React.ReactNode
}

const RequireAuth = ({children}: RequireAuthProps) => {
    const location = useLocation()
    const userData = localStorage.getItem('LoggedInUser')
    const auth = useAuth()
    if(userData){
        const user = JSON.parse(userData)
        auth.login(user)
    }else{
        return <Navigate to="/login" state={{path:location.pathname}} />
    }
  return children
}

export default RequireAuth