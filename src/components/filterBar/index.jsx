"use client";
import { apiClient } from "@/services/api";
import React, { useEffect, useState } from "react";
import { MdFilterAlt, MdClose } from "react-icons/md";
import { useQuery } from "react-query";

export function FilterBar({ setFilter, filter }) {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useQuery("categories", getCategories);
  const isSelected = (category) => filter === category;

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function getCategories() {
    const { data } = await apiClient.get(`/categories`);
    return data;
  }

  function handleCategoryClick(category) {
    if (isSelected(category)) {
      return setFilter("");
    }
    return setFilter(category);
  }

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (isError) {
    return <p>Erro ao carregar categorias</p>;
  }

  return (
    <ul className="flex flex-wrap gap-3 w-full relative justify-end pr-12 py-2">
      {isFilterOpen &&
        categories.map(({ category }) => (
          <li
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`animate-slide-right-to-left px-4 h-11 rounded-full bg-gray-200 text-gray-800 font-bold flex justify-center items-center gap-2 cursor-pointer ${
              isSelected(category) ? "bg-gray-400" : ""
            }`}
          >
            <p>{category}</p>
            {isSelected(category) && <MdClose size={18} />}
          </li>
        ))}
      <button
        className="absolute top-2 right-0 text-gray-500 bg-white rounded-full"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        {isFilterOpen ? <MdClose size={36} /> : <MdFilterAlt size={36} />}
      </button>
    </ul>
  );
}
