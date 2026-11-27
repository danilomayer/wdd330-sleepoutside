import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".order-summary");
order.init();

const form = document.querySelector("#checkout-form");

// tax, shipping and total are calculated once the zip code is filled in
document.querySelector("#zip").addEventListener("blur", () => {
    order.calculateOrderTotal();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // do not submit unless every field is filled out and valid
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (order.itemCount === 0) {
        alertMessage("Your cart is empty.");
        return;
    }

    await order.checkout(form);
});