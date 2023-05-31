import Image from "next/image";
import React from "react";
import { Tag } from "@/components";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { priceFormatter } from "@/helpers";
import { apiClient } from "@/services/api";

export function CartItemRow({
  id,
  image,
  name,
  category,
  description,
  quantityAvailable,
  price,
  quantity,
  refetch,
}) {
  const [quantityState, setQuantityState] = React.useState(quantity);

  React.useEffect(() => {
    setQuantityState(quantity);
  }, [quantity, refetch]);

  async function handleQuantityChange(e, action) {
    e.preventDefault();
    if (action === "add") {
      if (quantityAvailable > 0) {
        await updateQuantity(quantityState + 1);
        return setQuantityState(quantityState + 1);
      }
      return;
    }

    if (quantityState > 1) {
      await updateQuantity(quantityState - 1);
      return setQuantityState(quantityState - 1);
    }

    return;
  }

  async function updateQuantity(quantity) {
    await apiClient.put(`/cart?id=${id}`, {
      quantity,
    });
    return refetch();
  }

  async function removeItem(e) {
    e.preventDefault();
    await apiClient.delete(`/cart?id=${id}`);
    return refetch();
  }

  return (
    <tr key={id} className="border">
      <td className="flex w-full gap-2 p-2">
        <div className="w-24 h-24 relative">
          <Image fill className=" object-cover" src={image} alt={name} />
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <h2 className="text-xl font-bold">
            {name} <Tag label={category} className="text-sm" />
          </h2>
          <p className="text-sm">{description}</p>
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="flex">
          <button
            onClick={(e) => handleQuantityChange(e, "remove")}
            className="h-10 w-10 justify-center items-center flex border rounded-md"
          >
            <AiOutlineMinus />
          </button>
          <div className="h-10 w-10 justify-center items-center flex">
            {quantityState}
          </div>
          <button
            onClick={(e) => handleQuantityChange(e, "add")}
            className="h-10 w-10 justify-center items-center flex border rounded-md"
          >
            <AiOutlinePlus />
          </button>
        </div>
        <button onClick={removeItem} className="text-red-500 underline">
          Remover
        </button>
      </td>
      <td className="text-center p-3">
        <p className="text-sm whitespace-nowrap">{priceFormatter(price)}</p>
        <p className="text-sm whitespace-nowrap">
          {priceFormatter(price * quantityState)}
        </p>
      </td>
    </tr>
  );
}
