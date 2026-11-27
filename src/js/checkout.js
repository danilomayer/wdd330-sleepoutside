import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".order-summary");
order.init();

const form = document.querySelector("#checkout-form");
const message = document.querySelector("#checkout-message");

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

    if (order.list.length === 0) {
        message.textContent = "Your cart is empty.";
        return;
    }

    try {
        const response = await order.checkout(form);
        console.log(response);
        message.textContent = "Order placed successfully!";
    } catch (err) {
        console.log(err);
        message.textContent =
            "Something went wrong placing your order. Check the console for details.";
    }
});