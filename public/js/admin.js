const deleteProduct = async (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  const result = await fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  }).catch((err) => console.log(err));
  const data = await result.json();
  console.log(data);
  productElement.parentNode.removeChild(productElement);
};
