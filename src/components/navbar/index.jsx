"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";
import LogoSvg from "@/assets/logo.png";
import { Search } from "../index";

export function Navbar() {
  const [searchInFocus, setSearchInFocus] = useState(false);

  return (
    <header className="flex justify-between px-4 md:px-20 items-center gap-12 duration-200 ease-in-out">
      <div className={`flex w-full items-center gap-2 md:py-0  ${searchInFocus ? "py-3" : "w-full"}`}>
        <Link
          href="/"
          className={`relative w-20 h-20 ${
            searchInFocus ? "hidden" : ""
          } md:block`}
        >
          <Image
            fill
            className="object-contain"
            src={LogoSvg}
            alt="Genesis EComm"
          />
        </Link>
        <Search setSearchInFocus={setSearchInFocus} />
      </div>
      <nav className={`md:flex gap-4 text-gray-600 duration-200 ease-in-out ${searchInFocus ? "hidden" : "flex" }`}>
        <Link
          href="/carrinho"
          className="hover:opacity-60 duration-200 ease-in-out"
        >
          <FiShoppingCart size={48} />
        </Link>
        <aside className="relative group z-50">
          <CgProfile
            size={48}
            className="hover:opacity-60 duration-200 ease-in-out"
          />
          <ul className="hidden flex-col absolute right-0 top-12 bg-gray-200 px-8 py-6 rounded-xl group-hover:flex text-lg shadow-xl items-start gap-4">
            <li className="whitespace-nowrap w-full">
              <Link
                className="p-2 hover:bg-gray-400 flex rounded-md duration-200 ease-in-out"
                href="/meus-produtos"
              >
                Meus Produtos
              </Link>
            </li>
            <li className="whitespace-nowrap w-full">
              <Link
                className="p-2 hover:bg-gray-400 flex rounded-md duration-200 ease-in-out"
                href="/login"
              >
                Sair
              </Link>
            </li>
          </ul>
        </aside>
      </nav>
    </header>
  );
}
