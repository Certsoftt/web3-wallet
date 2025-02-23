import React, { useContext, useState } from 'react'

type AuthProviderProps = {
    children: React.ReactNode
    providerURL: string
}
export type User = {
    id: string
    address: string
    mnmonic: string
    email: string
    username: string
    privatekey: string
}
type AuthContextValue = {
    user: null|User
    login: (user: User) => void
    logout: ()=>void
    providerURL: string
}
const AuthContext = React.createContext({} as AuthContextValue)

const AuthProvider = ({children, providerURL}:AuthProviderProps) => {
    const [user, setUser] = useState<null | User>(null)
    const login=(user: User)=>{
        setUser(user)
    }
    const logout = ()=>{
        setUser(null)
    }
  return (
    <React.Fragment>
        <AuthContext.Provider value={{user, login, logout, providerURL}}>
            {children}
        </AuthContext.Provider>
    </React.Fragment>
  )
}
export const useAuth = ()=>{
    return useContext(AuthContext)
}
export default AuthProvider