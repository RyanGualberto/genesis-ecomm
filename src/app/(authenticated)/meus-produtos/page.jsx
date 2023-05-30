"use client";
import React from "react";
import { useQuery } from "react-query";
import { AiOutlinePlus } from "react-icons/ai";
import { ProductCard, Modal } from "@/components";
import { apiClient } from "@/services/api";

export default function MyProducts() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const {
    data: products,
    error,
    isLoading,
    refetch,
  } = useQuery("products", getProducts);

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function changePage(action) {
    if (action === "next" && page < products.pages) {
      setPage(page + 1);
    }

    if (action === "previous" && page > 1) {
      setPage(page - 1);
    }
  }

  async function getProducts() {
    const { data } = await apiClient.get(`/products/my-products?page=${page}`);

    return data;
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
    <main className="flex flex-col items-center px-1 md:px-24 gap-8">
      <h1 className="text-4xl font-bold w-full text-left">Meus Produtos</h1>
      {products.products.length > 0 ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-20">
            {products.products.map((product) => (
              <ProductCard
                productId={product.id}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                quantityAvailable={product.quantityAvailable}
                key={product.id}
                category={product.category}
                userId={product.userId}
                refetch={refetch}
              />
            ))}
          </section>
          <div className="flex gap-2 items-center">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
              onClick={() => changePage("previous")}
            >
              Anterior
            </button>
            <span className="whitespace-nowrap">
              Página {page} de {products.pages}
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
        <p className="text-2xl font-bold text-center">
          Você ainda não possui produtos cadastrados
        </p>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed p-4 bg-green-700 rounded-full text-white right-1 md:right-20 bottom-5 hover:bg-green-600 transition duration-300 ease-in-out scale-50 md:scale-100"
      >
        <AiOutlinePlus size={48} />
      </button>
      <Modal
        refetch={refetch}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </main>
  );
}
