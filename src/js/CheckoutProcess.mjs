import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}

// takes the items currently stored in the cart (localStorage) and returns them
// in the simplified form the server expects. The cart stores one entry per
// click (older carts) or one with a quantity, so both are merged by id.
function packageItems(items) {
    const merged = new Map();

    items.forEach((item) => {
        if (merged.has(item.Id)) {
            merged.get(item.Id).quantity += item.quantity || 1;
        } else {
            merged.set(item.Id, {
                id: item.Id,
                name: item.Name,
                price: item.FinalPrice,
                quantity: item.quantity || 1,
            });
        }
    });

    return [...merged.values()];
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    get itemCount() {
        return this.list.reduce((n, item) => n + (item.quantity || 1), 0);
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce(
            (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
            0,
        );

        const summary = document.querySelector(this.outputSelector);
        summary.querySelector("#num-items").innerText = this.itemCount;
        summary.querySelector("#subtotal").innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        // 6% sales tax on the subtotal
        this.tax = this.itemTotal * 0.06;

        // $10 for the first item plus $2 for each additional item
        const count = this.itemCount;
        this.shipping = count > 0 ? 10 + (count - 1) * 2 : 0;

        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const summary = document.querySelector(this.outputSelector);
        summary.querySelector("#tax").innerText = `$${this.tax.toFixed(2)}`;
        summary.querySelector("#shipping").innerText = `$${this.shipping.toFixed(2)}`;
        summary.querySelector("#orderTotal").innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout(form) {
        // make sure the totals are current even if the zip field was never blurred
        this.calculateOrderTotal();

        const order = formDataToJSON(form);
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal.toFixed(2);
        order.tax = this.tax.toFixed(2);
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
            const response = await services.checkout(order);
            console.log(response);

            // happy path: empty the cart and go to the success page
            localStorage.removeItem(this.key);
            window.location.assign("success.html");
        } catch (err) {
            // unhappy path: stay on the form so nothing the user typed is lost
            console.log(err);
            const body = err.message;
            let messages;
            if (typeof body === "string") {
                messages = [body];
            } else if (body && typeof body === "object") {
                // the server may send {message: "..."} or an object of messages
                messages = Object.values(body).map((v) =>
                    typeof v === "string" ? v : JSON.stringify(v),
                );
            } else {
                messages = ["Something went wrong placing your order."];
            }
            messages.forEach((msg) => alertMessage(msg));
        }
    }
}