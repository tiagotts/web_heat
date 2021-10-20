import {createContext, ReactNode, useEffect, useState} from 'react';
import { api } from '../../services/api';


type User = {
  id: string;
  name: string;
  avatar_url: string;
  login: string;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

export function AuthProvider(props:AuthProvider) {

  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=a869cd87036d39e61ebb`

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })
  
    const {token, user} = response.data;
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    localStorage.setItem('@nlw.token', token);
    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@nlw.token')
  }

  useEffect(() =>{
    const token = localStorage.getItem('@nlw.token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      api.get<User>('profile').then(response => {
        console.log(response.data);
        setUser(response.data);
      })
    }
  }, [])
  
  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');
  
    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');
      window.history.pushState({}, '', urlWithoutCode);
      signIn(githubCode);
    }
  }, [])

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}