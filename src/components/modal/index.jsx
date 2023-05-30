"use client";
import { useState } from "react";
import { apiClient } from "@/services/api";
import { storage } from "@/services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";

export function Modal({
  isModalOpen,
  setIsModalOpen,
  isEdit,
  editData,
  refetch,
}) {
  const initialProductState = isEdit
    ? editData
    : {
        name: "",
        description: "",
        price: "",
        quantityAvailable: "",
        category: "",
        image: "",
      };
  const [product, setProduct] = useState(initialProductState);
  const [image, setImage] = useState(undefined);

  function closeModal() {
    setIsModalOpen(false);
    setProduct(initialProductState);
  }

  function errorNotify(fieldName) {
    return toast.error(`O campo ${fieldName} está inválido!`);
  }

  function handleSetProduct(e) {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  }

  async function createOrEditProduct(e) {
    e.preventDefault();
    const oldName = isEdit && editData.name;
    const { name, description, price, quantityAvailable, category } = product;
    const method = isEdit ? "put" : "post";
    const url = `/products?name=${oldName}`;
    try {
      await apiClient[method](url, {
        ...(isEdit ? { newName: name } : { name }),
        description,
        price: Number(price),
        quantityAvailable: Number(quantityAvailable),
        category,
        image: image ? await uploadImage() : isEdit ? editData.image : "",
      });
      refetch();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadImage() {
    if (!image) return;

    try {
      const fileRef = ref(storage, `images/${image.name}`);
      await uploadBytes(fileRef, image);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.log(error);
    }
  }

  if (!isModalOpen) return null;

  return (
    <aside className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col gap-2">
        <h1 className="text-4xl font-bold w-full text-left">
          Adicionar Produto
        </h1>
        <form onSubmit={createOrEditProduct} className="flex flex-col gap-4">
          <input
            onChange={handleSetProduct}
            name="name"
            type="text"
            value={product.name}
            maxLength={30}
            required
            placeholder="Nome"
            onInvalid={() => errorNotify("Nome")}
            className="border border-gray-400 rounded-lg p-2"
          />
          <input
            onChange={handleSetProduct}
            name="description"
            type="text"
            value={product.description}
            maxLength={120}
            required
            placeholder="Descrição"
            onInvalid={() => errorNotify("Descrição")}
            className="border border-gray-400 rounded-lg p-2"
          />
          <input
            onChange={handleSetProduct}
            name="price"
            type="number"
            value={product.price}
            required
            placeholder="Preço"
            onInvalid={() => errorNotify("Preço")}
            className="border border-gray-400 rounded-lg p-2"
          />
          <input
            onChange={handleSetProduct}
            name="quantityAvailable"
            type="number"
            value={product.quantityAvailable}
            required
            onInvalid={() => errorNotify("Quantidade Disponível")}
            placeholder="Quantidade Disponível"
            className="border border-gray-400 rounded-lg p-2"
          />
          <input
            onChange={handleSetProduct}
            name="category"
            placeholder="Categoria"
            value={product.category}
            required
            onInvalid={() => errorNotify("Categoria")}
            className="border border-gray-400 rounded-lg p-2"
            type="text"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            className="border border-gray-400 rounded-lg p-2"
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => closeModal()}
              className="bg-red-700 rounded-lg p-2 text-white hover:bg-red-600 transition duration-300 ease-in-out px-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-700 rounded-lg p-2 text-white hover:bg-green-600 transition duration-300 ease-in-out px-4"
            >
              {isEdit ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
