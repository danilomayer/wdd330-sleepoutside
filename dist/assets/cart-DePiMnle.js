import{g as e,u as s,s as n}from"./utils-BlSBd0h3.js";function l(a){const t=e("so-cart")||[],r=t.findIndex(c=>c.Id===a);r!==-1&&(t.splice(r,1),n("so-cart",t),o())}function o(){const t=(e("so-cart")||[]).map(r=>d(r));document.querySelector(".product-list").innerHTML=t.join(""),document.querySelectorAll(".cart-card__remove").forEach(r=>{r.addEventListener("click",c=>{l(c.currentTarget.dataset.id)})}),s()}function d(a){return`<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${a.Id}" aria-label="Remove ${a.Name} from cart">X</button>
  <a href="#" class="cart-card__image">
    <img
      src="${a.Image}"
      alt="${a.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${a.Name}</h2>
  </a>
  <p class="cart-card__color">${a.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${a.FinalPrice}</p>
</li>`}o();
