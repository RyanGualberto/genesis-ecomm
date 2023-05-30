"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/services/api";
import { toast } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
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

  async function handleSignUp(e) {
    e.preventDefault();
    const { email, password } = user;

    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      const { token } = await data;
      if (!token) {
        return toast.error("Usuário ou senha incorretos");
      }

      document.cookie = `token=${token}; path=/`;
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 border-2 border-gray-600 shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl text-white font-semibold mb-6">Entrar</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="username"
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
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="password"
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
            Entrar
          </button>
        </form>
        <div className="mt-6 flex justify-between">
          <p className="text-gray-400 text-sm">Ainda não tem uma conta?</p>
          <Link
            href="/cadastro"
            className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </main>
  );
}
