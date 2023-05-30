"use client";
import React, { useContext } from "react";
import { IoMdSearch } from "react-icons/io";
import { useRouter, usePathname } from "next/navigation";
import { SearchContext } from "@/contexts/searchContext";

export function Search({}) {
  const { search, setSearch } = useContext(SearchContext);
  const router = useRouter();
  const pathname = usePathname();

  function handleSearch(e) {
    e.preventDefault();
    setSearch(e.target.value);
    if (pathname !== "/") {
      router.push("/");
    }
  }

  return (
    <div
      className="flex items-center bg-white rounded-2xl w-full justify-between h-14
      border-gray-200 border-2"
    >
      <input
        onChange={handleSearch}
        value={search}
        className="w-full h-full rounded-l-xl px-5 text-lg"
        type="text"
      />
      <IoMdSearch size={36} className="mr-5" />
    </div>
  );
}
