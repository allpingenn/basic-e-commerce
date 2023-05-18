//! Local Data
async function getData() {
  const datas = await fetch("data.json");

  const data = await datas.json();

  data ? localStorage.setItem("products", JSON.stringify(data)) : [];
  searchProducts(data);
}
getData();
//! Local Data Function End

//! Basket and Products Directory

//Products Data
let products = localStorage.getItem("products")
  ? JSON.parse(localStorage.getItem("products"))
  : [];

//Basket Data
let cart = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];
//! Basket and Products Directory End

//! Number of Basket Update not a quantity on Cartpage

function updateCartCount() {
  //Number of Basket from localStorage
  const cartItemCount = localStorage.getItem("cartItemCount");

  const cartItems = document.getElementsByClassName("cart-count");

  //Update if there is a product in the basket
  if (cartItemCount) {
    cartItems[0].textContent = cartItemCount;
  }
}
updateCartCount();
//! Number of Basket Update End

//! Add Cart to Quantity Updater on Cartpage

function addtoCartQuantity(cart) {
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  localStorage.setItem("cartItemCount", cartItemCount);
  updateCartCount();
}
addtoCartQuantity(cart);
//! Add Cart to Quantity Updater End

//! Add to Cart Function

function addToCart(cartItem, id) {
  if (cartItem == null || typeof cartItem == "undefined") {
    const findProduct = products.find((product) => product.id === Number(id));
    cart.push({ ...findProduct, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    addtoCartQuantity(cart);
  } else {
    let newCartItem = cartItem;
    newCartItem.quantity += 1;
    let newCart = cart.filter((item) => item.id !== id);
    newCart.push(newCartItem);
    console.log(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    addtoCartQuantity(newCart);
  }
}

//! Add Product to Basket and Cart

function addToCartButtonSetting() {
  const buttons = [...document.getElementsByClassName("add-to-cart")];

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const id = e.target.dataset.id;
      //If the product has not been added to the cart before, it will be added to the cart.
      const cartItem = cart.find((item) => item.id === Number(id));
      addToCart(cartItem, Number(id));
    });
  });
}
//! Add Product to Basket and Cart End

//! View Products

function productsFunc(filteredList = null) {
  const productsContainer = document.getElementById("product-list");

  //Create cards for each product
  let results = "";

  const renderList = filteredList != null ? filteredList : products;

  renderList.forEach((item) => {
    results += `
      <div class="col-lg-4 col-md-6 mt-5">
        <div class="card text-center">
          <img src=${item.img} class="card-img-top product-link" data-id=${item.id} alt="urun1" />
          <div class="card-body">
            <h5 class="card-title">$${item.price}</h5>
            <p class="card-text">${item.name} </p>
            <a href="#" class="btn btn-warning add-to-cart" data-id=${item.id}>
              <i class="bi bi-basket2-fill"></i>
              Add to Cart</a>
          </div>
        </div>
      </div>
    `;
  });

  productsContainer.innerHTML = results;
  addToCartButtonSetting();
  productsLink();
}
//! View Products End

//!If index page or products page loaded(syntax error fix)
if (
  document.getElementById("indexPage") ||
  document.getElementById("ProductionsPage")
) {
  productsFunc();
  updateCartCount();
}
//! View Products End

//! Product Link for Product Detail Page

function productsLink() {
  const productLink = document.getElementsByClassName("product-link");
  Array.from(productLink).forEach((button) => {
    button.addEventListener("click", function (e) {
      const id = e.target.dataset.id;
      localStorage.setItem("productId", JSON.stringify(id));

      //window.location.href use on 2 different pages
      if (window.location.pathname.includes("pages")) {
        window.location.href = "productdetail.html";
      } else {
        window.location.href = "pages/productdetail.html";
      }
    });
  });
}
//! Product Link for Product Detail Page End

//! Cart Page Products

function displayCartProduct() {
  const cartWrapper = document.getElementsByClassName("cart-wrapper");

  //Create tbody for each product
  let result = "";

  cart.forEach((item) => {
    result += `
      <tr class="cart-item">
        <td class="p-md-4">
          <img src=${item.img} alt="" class="w-75 rounded">
        </td>
        <td class="fw-bold">${item.name}</td>
        <td class="fw-bold text-center">$${item.price}</td>
        <td class="text-center">
        <button class="btn btn-warning px-lg-3 px-sm-3 px-3 px-md-2 rounded-3 decrease-quantity fw-bolder" data-id=${
          item.id
        }>-</button>
          <span class="fw-bold p-1 border px-lg-3 px-md-2  px-sm-3 px-3 bg-light">${
            item.quantity
          }</span>
          <button class="btn btn-warning px-lg-3 px-sm-3 px-3 px-md-2 rounded-3 increase-quantity fw-bolder" data-id=${
            item.id
          }>+</button>
        </td>
        <td class="fw-bold text-center">$${item.price * item.quantity}</td>
        <td class="fw-bolder"><i class="bi bi-x-lg delete-cart border p-2 bg-light rounded-2" data-id=${
          item.id
        }></i></td>
      </tr>
    `;
  });

  cartWrapper[0].innerHTML = result;
  changeQuantity();
  deleteCartItem();
  cartTotals();
}

//If cart page loaded(syntax error fix)
if (document.getElementById("cartPage")) {
  displayCartProduct();
  cartTotals();
}
//! Cart Page Products End

//! Change Quantity / Increase and Decrease

function changeQuantity() {
  const increaseBtn = document.querySelectorAll(".increase-quantity");

  const decreaseBtn = document.querySelectorAll(".decrease-quantity");

  //Increase
  increaseBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number(btn.dataset.id);
      const item = cart.find((item) => item.id === id);
      item.quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCartProduct();
      // Basket Counter Update
      addtoCartQuantity(cart);
      cartTotals();
    });
  });

  //Decrease
  decreaseBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number(btn.dataset.id);
      const item = cart.find((item) => item.id === id);
      if (item.quantity > 1) {
        item.quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCartProduct();
        // Basket Counter Update
        addtoCartQuantity(cart);
        cartTotals();
      }
    });
  });
}

//! Delete Cart Item

function deleteCartItem() {
  const btnDeleteCart = document.getElementsByClassName("delete-cart");

  Array.from(btnDeleteCart).forEach((button) => {
    button.addEventListener("click", function (e) {
      const id = e.target.dataset.id;
      cart = cart.filter((item) => item.id !== Number(id));
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCartProduct();
      // Basket Counter Update
      addtoCartQuantity(cart);
      cartTotals();
    });
  });
}

//! Cart Totals

function cartTotals() {
  const cartTotal = document.getElementById("cart-total");
  const subTotal = document.getElementById("sub-total");

  let itemsTotal = 0;

  cart.length > 0 &&
    cart.map((item) => (itemsTotal += item.price * item.quantity));
  subTotal.innerText = `$${itemsTotal}`;
  cartTotal.innerText = `$${itemsTotal + 2}`;
}
//! Totals End

//! Search Function

function searchProducts(products) {
  const productsContainer = document.getElementById("product-list");

  const search = document.getElementById("search");

  let value = "";
  let filterProducts = [];

  if (search) {
    search.addEventListener("input", (e) => {
      value = e.target.value;
      value = value.toLowerCase().trim();
      filterProducts = products.filter((item) =>
        item.name.toLowerCase().trim().includes(value)
      );
      productsFunc(filterProducts);
    });
  }
}

//!Products Detail Page

const productId = localStorage.getItem("productId")
  ? JSON.parse(localStorage.getItem("productId"))
  : localStorage.setItem("productId", JSON.stringify(1));

const findProduct = products.find((item) => item.id === Number(productId));

// breadcrumbtitle
const breadcrumbTitle = document.querySelector(".breadcrumb-title");
if (breadcrumbTitle) {
  breadcrumbTitle.innerHTML = findProduct.name;
}

// product title
const productTitle = document.querySelector(".product-title");

if (productTitle) {
  productTitle.innerHTML = findProduct.name;
}

// product price
const productPrice = document.querySelector(".product-price2");

if (productPrice) {
  productPrice.innerHTML = "$" + findProduct.price;
}

// product image
const productImg = document.getElementById("product-img");

if (productImg) {
  productImg.src = findProduct.img;
}

// //! Products Detail Add Cart

if (document.getElementById("productiondetailPage")) {
  const addCart = document.getElementById("add-to-cart");

  addCart.addEventListener("click", function (e) {
    e.preventDefault();
    const cartItem = cart.find((item) => item.id === findProduct.id);
    addToCart(cartItem, findProduct.id);
  });
}
