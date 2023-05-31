"use client";
import React, { useContext } from "react";
import { ProductCard, FilterBar } from "@/components";
import { useQuery } from "react-query";
import { SearchContext } from "@/contexts/searchContext";
import { apiClient } from "@/services/api";

export default function Home() {
  const { data, error, isLoading, refetch } = useQuery("products", getProducts);
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    refetch: refetchCategories,
  } = useQuery("categories", getCategories);
  const [page, setPage] = React.useState(1);
  const [filter, setFilter] = React.useState(null);
  const { search } = useContext(SearchContext);

  async function getProducts() {
    const filterUrl = filter ? `&filter=${filter}` : "";
    const searchUrl = search ? `&search=${search}` : "";
    const url = `/products?page=${page}${filterUrl}${searchUrl}`;

    const { data } = await apiClient.get(url);

    return data;
  }

  async function getCategories() {
    const { data } = await apiClient.get("/categories");

    return data;
  }

  React.useEffect(() => {
    refetch();
    refetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  React.useEffect(() => {
    refetch();
    refetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
      refetchCategories();
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function changePage(action) {
    if (action === "next" && page < products.pages) {
      setPage(page + 1);
    }

    if (action === "previous" && page > 1) {
      setPage(page - 1);
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-col items-center px-4 md:px-24 gap-16">
        <div
          className={`block animate-pulse bg-gray-200 rounded-lg w-full min-h-[120px]`}
        />
        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-20 items-center">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`block animate-pulse bg-gray-300 rounded-lg min-w-[240px] min-h-[360px]`}
            />
          ))}
        </section>
      </main>
    );
  }

  if (error) {
    return <p>Erro ao carregar produtos</p>;
  }

  return (
    <main className="flex flex-col items-center px-4 md:px-24 gap-16">
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        isErrorCategories={isErrorCategories}
        refetchCategories={refetchCategories}
      />
      {data.products.length > 0 ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-20 items-center">
            {data.products.map((product) => (
              <ProductCard
                id={product.id}
                productId={product.id}
                key={product.id}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                quantityAvailable={product.quantityAvailable}
                category={product.category}
                userId={product.userId}
                userSeller={product.User?.name}
                refetch={refetch}
              />
            ))}
          </section>
          <div className="flex gap-2 items-center justify-center w-full">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
              onClick={() => changePage("previous")}
            >
              Anterior
            </button>
            <span className="whitespace-nowrap">
              Página {page} de {data.pages}
            </span>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
              onClick={() => changePage("next")}
            >
              Próximo
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">Nenhum produto encontrado</h1>
        </div>
      )}
    </main>
  );
}
