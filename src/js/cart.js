import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function removeFromCart(itemId) {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex((item) => item.Id === itemId);

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

function renderCartTotal(cartItems) {
  const footer = document.querySelector(".cart-footer");

  // nothing in the cart: hide the total and the checkout link
  if (cartItems.length === 0) {
    footer.classList.add("hide");
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  document.querySelector("#cart-total").textContent = `$${total.toFixed(2)}`;
  footer.classList.remove("hide");
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  document.querySelectorAll(".cart-card__remove").forEach((button) => {
    button.addEventListener("click", (event) => {
      removeFromCart(event.currentTarget.dataset.id);
    });
  });

  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">X</button>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium ?? item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();