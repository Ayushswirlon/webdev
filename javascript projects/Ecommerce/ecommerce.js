document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const cartTotal = document.getElementById("cart-total");
  const totalPrice = document.getElementById("total-price");
  const checkoutButton = document.getElementById("checkout-btn");

  const products = [
    { id: 1, name: "Clock", Price: 29.99 },
    { id: 2, name: "Globe", Price: 19.99 },
    { id: 3, name: "Balloon", Price: 39.99 },
    { id: 4, name: "Robot", Price: 39.99 },
    { id: 5, name: "Dress", Price: 39.99 },
    { id: 6, name: "Maniac", Price: 39.99 },
  ];
  const CartStatus = JSON.parse(localStorage.getItem("status")) || false;
  let cart = JSON.parse(localStorage.getItem("items")) || [];

  if (CartStatus) {
    emptyCart.classList.add("hidden");
    cartTotal.classList.remove("hidden");
  }
  renderCart();
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
    <span>${product.name}-$${product.Price.toFixed(2)}</span>
    <button data-id='${product.id}'>Add to cart</button>
    `;
    productList.appendChild(productDiv);
  });
  productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId);
      console.log(product);

      addToCart(product);
    }
  });
  cartItems.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = parseInt(e.target.getAttribute("data-id1"));
      removeCartItem(index);
    }
  });
  function removeCartItem(index) {
    cart.splice(index, 1);
    saveTasks(cart);
    saveStatus(true);

    renderCart();
  }
  function addToCart(product) {
    cart.push(product);
    saveTasks(cart);
    saveStatus(true);
    renderCart();
  }
  function renderCart() {
    cartItems.innerText = "";
    let total = 0;
    if (cart.length) {
      emptyCart.classList.add("hidden");
      cartTotal.classList.remove("hidden");
      cart.forEach((item, index) => {
        total += item.Price;
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `<div>${item.name} - $${item.Price.toFixed(
          2
        )}</div>
        <button data-id1='${index}'>remove</button>`;
        cartItems.appendChild(cartItem);
        totalPrice.textContent = `$${total.toFixed(2)}`;
        saveStatus(true);
      });
    } else {
      emptyCart.classList.remove("hidden");

      totalPrice.textContent = `$0.00`;
    }
  }

  checkoutButton.addEventListener("click", () => {
    if (cart.length !== 0) {
      cart.length = 0;
      alert("Checkout Successful");
      renderCart();
      saveStatus(false);
      saveTasks(cart);
    }
  });
  function saveTasks(item) {
    localStorage.setItem("items", JSON.stringify(item));
  }
  function saveStatus(CartStatus) {
    localStorage.setItem("status", CartStatus);
  }
});
