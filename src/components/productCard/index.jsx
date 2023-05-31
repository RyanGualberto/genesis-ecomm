"use client";
import React from "react";
import { useMutation } from "react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { priceFormatter } from "@/helpers";
import jwt from "jsonwebtoken";
import { Modal, QuantitySelector, Tag, ProductActions } from "@/components";
import { apiClient } from "@/services/api";

export function ProductCard({
  productId,
  image,
  name,
  description,
  price,
  quantityAvailable,
  category,
  userId,
  refetch,
  userSeller,
}) {
  const router = useRouter();
  const { token } = parseCookies();
  const { id: userIdFromToken } = jwt.decode(token);
  const isAdminMode = userId === userIdFromToken;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const {
    mutate: mutateDeleteProduct,
    isLoading,
    error,
  } = useMutation("deleteProduct", deleteProduct, {
    onSuccess: () => {
      refetch();
    },
  });
  const { mutate: mutateAddToCart } = useMutation("addToCart", addToCart);
  
  async function deleteProduct() {
    const { data } = await apiClient.delete(`/products?name=${name}`);
    return data;
  }

  async function handleDeleteProductClick() {
    mutateDeleteProduct();
    return refetch();
  }

  async function addToCart() {
    console.log("productId", productId);
    const { data } = await apiClient.post(`/cart/add`, {
      productId,
      quantity: Number(quantity),
    });

    return data;
  }

  async function handleAddToCartClick() {
    mutateAddToCart();
    return router.push("/carrinho");
  }

  if (error) {
    return <div>Erro ao deletar produto</div>;
  }

  return (
    <>
      <article
        className={`flex flex-col w-fit justify-center items-center bg-gray-100 rounded-lg shadow-lg py-6 px-6 hover:shadow-2xl duration-200 ${
          isLoading ? "opacity-60" : "opacity-100"
        }`}
      >
        <div className="flex justify-center items-center h-48 w-48 rounded-lg overflow-hidden relative">
          <Image fill className="object-contain" src={image} alt="product" />
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h2 className="text-2xl font-bold py-2 w-60 truncate">{name}</h2>
          <div className="flex justify-start w-full">
            <Tag label={category} />
          </div>
          <p className="text-sm w-60 text-gray-500 py-2 truncate h-16">
            {description}
          </p>
          <QuantitySelector
            isAdminMode={isAdminMode}
            quantityAvailable={quantityAvailable}
            setQuantity={setQuantity}
          />
          <p className="text-2xl font-bold py-2 text-green-600">
            {priceFormatter(price)}
          </p>
          {userSeller && (
            <span className="text-sm text-gray-500 font-medium">
              Vendido por: {userSeller}
            </span>
          )}
          <div className="flex justify-center items-center w-full gap-4">
            <ProductActions
              isAdminMode={isAdminMode}
              quantityAvailable={quantityAvailable}
              handleEditProduct={() => setIsModalOpen(true)}
              handleDeleteProduct={handleDeleteProductClick}
              handleAddToCart={handleAddToCartClick}
            />
          </div>
        </div>
      </article>
      <Modal
        isModalOpen={isModalOpen}
        isEdit
        setIsModalOpen={setIsModalOpen}
        refetch={refetch}
        editData={{
          image,
          name,
          description,
          price,
          quantityAvailable,
          category,
        }}
      />
    </>
  );
}
