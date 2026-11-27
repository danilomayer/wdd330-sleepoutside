import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      console.error("Product not found:", this.productId);
      return;
    }

    this.renderProductDetails();

    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    if (!this.product) return;

    const cartItems = getLocalStorage("so-cart") || [];
    const existing = cartItems.find((item) => item.Id === this.product.Id);

    if (existing) {
      // already in the cart: just increase its quantity
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cartItems.push({ ...this.product, quantity: 1 });
    }

    setLocalStorage("so-cart", cartItems);
    alertMessage(`${this.product.NameWithoutBrand} added to your cart!`, false);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColor").textContent =
    product.Colors?.[0]?.ColorName ?? "";
  document.getElementById("productDesc").innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}