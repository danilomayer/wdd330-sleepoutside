import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const CART_KEY = "so-cart";

// Older carts stored one entry per click. Merge repeats into a single line
// with a quantity so every item in the cart has one.
function getCart() {
  const raw = getLocalStorage(CART_KEY) || [];
  const merged = [];

  raw.forEach((item) => {
    const existing = merged.find((m) => m.Id === item.Id);
    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      merged.push({ ...item, quantity: item.quantity || 1 });
    }
  });

  if (merged.length !== raw.length || raw.some((i) => !i.quantity)) {
    setLocalStorage(CART_KEY, merged);
  }
  return merged;
}

function removeFromCart(itemId) {
  const cartItems = getCart().filter((item) => item.Id !== itemId);
  setLocalStorage(CART_KEY, cartItems);
  renderCartContents();
}

function changeQuantity(itemId, change) {
  const cartItems = getCart();
  const item = cartItems.find((i) => i.Id === itemId);
  if (!item) return;

  item.quantity = Math.max(1, item.quantity + change);
  setLocalStorage(CART_KEY, cartItems);
  renderCartContents();
}

function renderCartTotal(cartItems) {
  const footer = document.querySelector(".cart-footer");

  // nothing in the cart: hide the total and the checkout link
  if (cartItems.length === 0) {
    footer.classList.add("hide");
    return;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * item.quantity,
    0
  );
  document.querySelector("#cart-total").textContent = `$${total.toFixed(2)}`;
  footer.classList.remove("hide");
}

function renderCartContents() {
  const cartItems = getCart();
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const lineTotal = (item.FinalPrice * item.quantity).toFixed(2);

  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-action="remove" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">X</button>
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
  <p class="cart-card__quantity">
    qty:
    <button class="qty-btn" data-action="decrease" data-id="${item.Id}" aria-label="Decrease quantity of ${item.Name}" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
    <span class="qty-value">${item.quantity}</span>
    <button class="qty-btn" data-action="increase" data-id="${item.Id}" aria-label="Increase quantity of ${item.Name}">+</button>
  </p>
  <p class="cart-card__price">$${lineTotal}</p>
</li>`;

  return newItem;
}

// one listener for every button, since the list is re-rendered on each change
document.querySelector(".product-list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === "remove") removeFromCart(id);
  if (action === "increase") changeQuantity(id, 1);
  if (action === "decrease") changeQuantity(id, -1);
});

renderCartContents();