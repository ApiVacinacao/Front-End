'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (cpf: string, password: string, remember: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        if (remember) localStorage.setItem('rememberMe', 'true');
        router.replace('/'); // ✅ redireciona direto para /
      } else {
        alert(data.error || 'CPF ou senha inválidos!');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor!');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Erro ao deslogar', err);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    router.replace('/Login');
  };

  const getToken = () => localStorage.getItem('token');

  return { login, logout, getToken, loading };
}
