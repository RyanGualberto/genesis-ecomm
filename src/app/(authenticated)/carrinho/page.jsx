"use client";
import React, { useEffect } from "react";
import { CartItemRow } from "@/components";
import { useQuery } from "react-query";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Link from "next/link";
import { priceFormatter } from "@/helpers";
import { apiClient } from "@/services/api";
import Loading from "@/app/loading";

export default function Cart() {
  const { data: cart, isLoading, error, refetch } = useQuery("cart", getCart);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function getCart() {
    const { data } = await apiClient.get("/cart");

    return data;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Erro ao carregar o carrinho</p>;
  }

  return (
    <main className="flex flex-col items-center px-4 md:px-24 gap-8 max-w-screen overflow-hidden">
      <h1 className="text-4xl font-bold w-full text-left">Meu carrinho</h1>
      {cart.CartItem.length === 0 ? (
        <section className="flex items-center justify-center text-gray-600 flex-col gap-2">
          <div className="flex w-32 h-32 items-center justify-center border-4 border-gray-600 rounded-full">
            <AiOutlineShoppingCart size={56} />
          </div>
          <p className="">Seu carrinho está vazio.</p>
          <Link href="/">Clique aqui para ver nossos produtos.</Link>
        </section>
      ) : (
        <>
          <div className="max-w-screen w-screen md:w-full overflow-scroll">
            <table className="border min-w-[500px]">
              <thead className="border">
                <tr>
                  <th className="w-full text-start p-2">Produto</th>
                  <th className="p-3">Quantidade</th>
                  <th className="p-3">
                    <p className="whitespace-nowrap">Preço unitário</p>
                    <p className="whitespace-nowrap">Subtotal</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.CartItem.map((cartItem) => (
                  <CartItemRow
                    key={cartItem.id}
                    category={cartItem.Product.category}
                    description={cartItem.Product.description}
                    id={cartItem.id}
                    image={cartItem.Product.image}
                    name={cartItem.Product.name}
                    price={cartItem.Product.price}
                    quantity={cartItem.quantity}
                    quantityAvailable={cartItem.Product.quantityAvailable}
                    refetch={refetch}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-end w-full">
            <p className="text-2xl font-bold">
              Total: {priceFormatter(cart.total)}
            </p>
          </div>
        </>
      )}
    </main>
  );
}
