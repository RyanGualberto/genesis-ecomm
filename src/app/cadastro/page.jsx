"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/api";
import { toast } from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    document.cookie = `token=; path=/`;
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }

  async function signUp() {
    const { name, email, password } = user;
    if (!name || !email || !password) {
      return toast.error("Preencha todos os campos!");
    }

    try {
      await apiClient.post("/auth/register", user);
      return router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    signUp();
  }

  return (
    <main className="bg-gray-900 flex items-center justify-center h-screen">
      <div className="bg-gray-800 border-2 border-gray-600 shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl text-white font-semibold mb-6">Cadastro</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              for="name"
            >
              Nome
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              type="text"
              name="name"
              onChange={handleInputChange}
              value={user.name}
              maxLength={40}
              placeholder="Insira seu nome"
            />
          </div>
          <div>
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              for="email"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              type="email"
              name="email"
              onChange={handleInputChange}
              value={user.email}
              placeholder="Insira seu email"
            />
          </div>
          <div>
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              for="password"
            >
              Senha
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleInputChange}
              value={user.password}
              placeholder="Insira sua senha"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              onClick={() => setShowPassword(!showPassword)}
            />
            <label className="text-gray-400 text-sm font-bold">
              Mostrar senha
            </label>
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
            type="submit"
          >
            Cadastrar
          </button>
        </form>
        <div className="mt-6 flex justify-between">
          <p className="text-gray-400 text-sm">Já tem uma conta?</p>
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
