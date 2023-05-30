export function ProductActions({
  isAdminMode,
  quantityAvailable,
  handleEditProduct,
  handleDeleteProduct,
  handleAddToCart,
}) {
  const buttonStyles =
    "text-white font-bold py-2 px-4 rounded-full duration-200 ease-in-out w-full";

  if (isAdminMode) {
    return (
      <>
        <button
          onClick={handleEditProduct}
          className={`bg-green-500 hover:bg-green-700 ${buttonStyles}`}
        >
          Editar
        </button>
        <button
          onClick={handleDeleteProduct}
          className={`bg-red-500 hover:bg-red-700 ${buttonStyles}`}
        >
          Remover
        </button>
      </>
    );
  } else {
    return (
      <button
        onClick={quantityAvailable > 0 ? handleAddToCart : null}
        disabled={quantityAvailable === 0}
        className={
          buttonStyles +
          (quantityAvailable === 0
            ? " bg-gray-500 cursor-not-allowed"
            : " bg-blue-500 hover:bg-blue-700")
        }
      >
        {quantityAvailable === 0
          ? "Produto indisponível"
          : "Adicionar ao carrinho"}
      </button>
    );
  }
}
