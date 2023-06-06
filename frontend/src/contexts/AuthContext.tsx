import { ReactNode, createContext } from "react";
import { api } from "../server";
import { isAxiosError } from "axios";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

interface IAuthProvider {
  children: ReactNode
}

interface IAuthContextData {
  signIn: ({email, password}: ISingIn) => void
}

interface ISingIn {
  email: string
  password: string
}

export const AuthContext = createContext({} as IAuthContextData)

export function AuthProvider({children} : IAuthProvider) {
  const navigate = useNavigate()
  async function signIn({email, password}: ISingIn) {
    try {
      const {data} = await api.post('/users/auth', {
        email,
        password
      });
      console.log("🚀 ~ file: authContext.tsx:28 ~ signIn ~ data:", data)
      const {token, refresh_token, user} = data;
      const userData = {
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url
      }
      localStorage.setItem('token:semana-heroi', token);
      localStorage.setItem('refresh_token:semana-heroi', refresh_token);
      localStorage.setItem('user:semana-heroi', JSON.stringify(userData));

      navigate('/dashboard')
      return data;
    } catch (error) {
      if(isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Tente mais tarde')
      }
    }
  }
  return (
    <AuthContext.Provider value={{signIn}}>
      {children}
    </AuthContext.Provider>
  )
}