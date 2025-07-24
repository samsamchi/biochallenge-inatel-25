"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="flex flex-col items-center mb-18 my-10 mr-25">
        <h1 className="text-2xl font-bold text-center text-gray-600 mb-8">
          Sistema de Gestão de Medicamentos
        </h1>
        <img 
          src="/medico.png" 
          alt="Médico" 
          className="w-70 h-auto" 
        />
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-600">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            Entrar
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/cadastro" className="text-blue-500 hover:underline">
            Criar conta
          </a>
          <span className="mx-2 text-gray-700">|</span>
          <a href="/recuperar-senha" className="text-blue-500 hover:underline">
            Recuperar senha
          </a>
        </div>
      </div>
    </div>
  );
}