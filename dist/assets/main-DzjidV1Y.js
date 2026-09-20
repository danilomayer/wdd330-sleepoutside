import{u as r}from"./utils-BlSBd0h3.js";import{P as i}from"./ProductData-Dx0C3TkS.js";class n{constructor(a,e,s){this.category=a,this.dataSource=e,this.listElement=s}async init(){const a=await this.dataSource.getData();this.renderList(a)}renderList(a){const e=a.map(c);this.listElement.insertAdjacentHTML("afterbegin",e.join(""))}}function c(t){const a=t.Image.replace("../","");return`<li class="product-card">
    <a href="product_pages/?product=${t.Id}">
      <img src="${a}" alt="Image of ${t.Name}">
      <h3 class="card__brand">${t.Brand.Name}</h3>
      <h2 class="card__name">${t.NameWithoutBrand}</h2>
      <p class="product-card__price">$${t.FinalPrice}</p>
    </a>
  </li>`}const o=new i("tents"),l=document.querySelector(".product-list"),d=new n("tents",o,l);d.init();r();
