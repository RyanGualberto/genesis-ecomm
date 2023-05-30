import React from "react";

export function QuantitySelector({
  quantityAvailable,
  setQuantity,
  isAdminMode,
}) {
  return (
    <div className="flex gap-1 justify-center">
      {!isAdminMode && quantityAvailable > 0 && (
        <select
          onChange={(e) => setQuantity(e.target.value)}
          className="bg-white text-gray-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent rounded-lg py-2 px-4 w-20"
        >
          {Array.from({ length: quantityAvailable }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      )}
      <p className="text-sm text-gray-500 py-2">
        {quantityAvailable} unidade{quantityAvailable > 1 && "s"}
        {quantityAvailable > 1 ? " disponíveis" : " disponível"}
      </p>
    </div>
  );
}
