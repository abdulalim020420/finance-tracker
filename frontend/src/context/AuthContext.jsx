import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
        authApi.me()
            .then((res) => setUser(res.data.data))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false))
        } else {
        setLoading(false)
        }
    }, [])

    const login = async (data) => {
        const res = await authApi.login(data)
        localStorage.setItem('token', res.data.data.token)
        setUser(res.data.data.user)
    }

    const register = async (data) => {
        const res = await authApi.register(data)
        localStorage.setItem('token', res.data.data.token)
        setUser(res.data.data.user)
    }

    const logout = async () => {
        await authApi.logout()
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
        {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)