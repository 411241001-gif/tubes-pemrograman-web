/* ========================================= */
/* NAVBAR */
/* ========================================= */

const navbar = document.querySelector(".navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* ========================================= */
/* SEARCH */
/* ========================================= */

const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

function filterSearch(keyword) {
  const allProducts = document.querySelectorAll(".product-card");

  allProducts.forEach((product) => {
    const title = product.querySelector("h4").innerText.toLowerCase();
    const category = product.dataset.category.toLowerCase();

    if (
      title.includes(keyword.toLowerCase()) ||
      category.includes(keyword.toLowerCase())
    ) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const keyword = searchInput.value.trim();

    if (keyword !== "") {
      window.location.href = `shop.html?search=${keyword}`;
    }
  });
}

const params = new URLSearchParams(window.location.search);
const searchKeyword = params.get("search");

if (searchKeyword && searchInput) {
  searchInput.value = searchKeyword;
  filterSearch(searchKeyword);
}

/* ========================================= */
/* FILTER */
/* ========================================= */

const checkboxes = document.querySelectorAll(".filter-checkbox");
const products = document.querySelectorAll(".product-card");

function filterProducts() {
  let selected = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selected.push(checkbox.value);
    }
  });

  products.forEach((product) => {
    const category = product.dataset.category;

    if (selected.length === 0 || selected.includes(category)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterProducts);
});

/* ========================================= */
/* SORT */
/* ========================================= */

const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const productGrid = document.getElementById("productGrid");

    let productArray = Array.from(
      productGrid.querySelectorAll(".product-card"),
    );

    productArray.sort((a, b) => {
      const priceA = Number(a.dataset.price);
      const priceB = Number(b.dataset.price);

      if (sortSelect.value === "low") {
        return priceA - priceB;
      }

      if (sortSelect.value === "high") {
        return priceB - priceA;
      }

      return 0;
    });

    productArray.forEach((product) => {
      productGrid.appendChild(product);
    });
  });
}

/* ========================================= */
/* LOAD MORE */
/* ========================================= */

const loadBtn = document.querySelector(".load-more button");
let visibleProducts = 3;


if (searchKeyword) {
 
  if (loadBtn) {
    loadBtn.style.display = "none";
  }
} else {
  
  if (products.length > 0) {
    products.forEach((product, index) => {
      if (index >= visibleProducts) {
        product.style.display = "none";
      }
    });
  }

  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      visibleProducts += 3;

      products.forEach((product, index) => {
        if (index < visibleProducts) {
          product.style.display = "block";
        }
      });

      if (visibleProducts >= products.length) {
        loadBtn.style.display = "none";
      }
    });
  }
}
/* ========================================= */
/* PRODUCT DETAIL & DYNAMIC PRICE */
/* ========================================= */

const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");
const quantityText = document.getElementById("quantity");
const productPriceEl = document.getElementById("product-price");
const sizeButtons = document.querySelectorAll(".size-btn");

let quantity = quantityText ? parseInt(quantityText.innerText) : 1;

function updatePrice() {
  if (!productPriceEl || !quantityText) return;

  const basePrice = parseInt(productPriceEl.dataset.basePrice);
  const currentQty = parseInt(quantityText.innerText);

  const activeSizeBtn = document.querySelector(".size-btn.active");
  const activeSize = activeSizeBtn ? activeSizeBtn.innerText : "S";

  let sizePrice = 0;
  if (activeSize === "M") sizePrice = 10000;
  if (activeSize === "L") sizePrice = 20000;

  const totalPrice = (basePrice + sizePrice) * currentQty;

  productPriceEl.innerText = "Rp" + totalPrice.toLocaleString("id-ID");
}

if (plusBtn) {
  plusBtn.addEventListener("click", () => {
    quantity++;
    quantityText.innerText = quantity;
    updatePrice();
  });
}

if (minusBtn) {
  minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityText.innerText = quantity;
      updatePrice();
    }
  });
}

/* ========================================= */
/* SIZE SELECTION */
/* ========================================= */

if (sizeButtons.length > 0) {
  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sizeButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      updatePrice();
    });
  });
}

/* ========================================= */
/* ADD TO CART (UPDATED WITH DYNAMIC PRICE)  */
/* ========================================= */

const addCartBtn = document.querySelector(".add-cart-btn");

if (addCartBtn) {
  addCartBtn.addEventListener("click", () => {
    const name = addCartBtn.dataset.name;
    const basePrice = parseInt(addCartBtn.dataset.price);
    const image = addCartBtn.dataset.image;

    const activeSize = document.querySelector(".size-btn.active");
    const selectedSize = activeSize ? activeSize.innerText : "S";

    const quantityText = document.getElementById("quantity");
    const selectedQuantity = quantityText
      ? parseInt(quantityText.innerText)
      : 1;

    let sizePrice = 0;
    if (selectedSize === "M") sizePrice = 10000;
    if (selectedSize === "L") sizePrice = 20000;

    const finalPricePerItem = basePrice + sizePrice;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
      name: name,
      price: finalPricePerItem,
      image: image,
      size: selectedSize,
      quantity: selectedQuantity,
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    showToast("Produk berhasil ditambahkan 🌿");
  });
}

/* ================= TOAST ================= */

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* ========================================= */
/* CART COUNT */
/* ========================================= */

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalQuantity = 0;

  cart.forEach((item) => {
    totalQuantity += item.quantity;
  });

  const cartCount = document.getElementById("cart-count");

  if (cartCount) {
    cartCount.innerText = totalQuantity;
  }
}

updateCartCount();

/* ================= CART PAGE ================= */

const cartItemsContainer = document.getElementById("cart-items");

if (cartItemsContainer) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <h2>Your cart is empty</h2>
        <p>Yuk cari tanaman favoritmu 🌿</p>
        <a href="shop.html" class="shop-now-btn">Shop Now</a>
      </div>
    `;

    const summaryBox = document.querySelector(".summary-box");
    if (summaryBox) {
      summaryBox.style.display = "none";
    }
  } else {
    let subtotal = 0;
    cartItemsContainer.innerHTML = "";

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <div class="cart-product">
            <img src="${item.image}" alt="">
            <div class="cart-details">
              <h3>${item.name}</h3>
              
              <div class="cart-size-select">
                <label>Size: </label>
                <select onchange="updateCartItemSize(${index}, this.value)">
                  <option value="S" ${item.size === "S" ? "selected" : ""}>S</option>
                  <option value="M" ${item.size === "M" ? "selected" : ""}>M</option>
                  <option value="L" ${item.size === "L" ? "selected" : ""}>L</option>
                </select>
              </div>

              <div class="cart-qty">
                <button onclick="decreaseQty(${index})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQty(${index})">+</button>
              </div>
              <p class="cart-price">
                Rp${itemTotal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <button class="remove-btn" onclick="removeItem(${index})">
            Remove
          </button>
        </div>
      `;
    });

    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const discountRow = document.getElementById("discount-row");
    const discountAmount = document.getElementById("discount-amount");

   
    let savedDiscount =
      parseFloat(localStorage.getItem("appliedDiscount")) || 0;

    if (subtotalElement) {
      subtotalElement.innerText = "Rp" + subtotal.toLocaleString("id-ID");
    }

    if (savedDiscount > 0 && discountRow && discountAmount) {
      discountRow.style.display = "flex";
      discountAmount.innerText = "-Rp" + savedDiscount.toLocaleString("id-ID");
    } else if (discountRow) {
      discountRow.style.display = "none";
    }

    if (totalElement) {
      let finalTotal = subtotal - savedDiscount + 10000;
      totalElement.innerText =
        "Rp" + (finalTotal < 0 ? 0 : finalTotal).toLocaleString("id-ID");
    }

    /* ================= LOGIKA KUPON ================= */
    const couponInput = document.getElementById("coupon-input");
    const couponMessage = document.getElementById("coupon-message");

    if (couponInput) {
      const LIST_KUPON = {
        TANAMANKU20: 20000,
        HEBOHPERSEN: 0.1,
        FLORA50: 50000,
      };

      couponInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();

          const kodeUser = couponInput.value.trim().toUpperCase();

          if (LIST_KUPON.hasOwnProperty(kodeUser)) {
            let nilaiPotongan = LIST_KUPON[kodeUser];
            let nominalDiskon = 0;

            if (nilaiPotongan < 1) {
              nominalDiskon = subtotal * nilaiPotongan;
            } else {
              nominalDiskon = nilaiPotongan;
            }

            const totalBaru = subtotal - nominalDiskon + 10000;

            if (discountRow) discountRow.style.display = "flex";
            if (discountAmount)
              discountAmount.innerText =
                "-Rp" + nominalDiskon.toLocaleString("id-ID");
            if (totalElement)
              totalElement.innerText =
                "Rp" + (totalBaru < 0 ? 0 : totalBaru).toLocaleString("id-ID");

            localStorage.setItem("appliedDiscount", nominalDiskon);

            if (couponMessage) {
              couponMessage.style.color = "#2ecc71";
              couponMessage.innerText = "Kupon berhasil dipasang! 🎉";
              couponMessage.style.display = "block";
            }
          } else {
            if (discountRow) discountRow.style.display = "none";
            localStorage.removeItem("appliedDiscount");

            if (totalElement) {
              totalElement.innerText =
                "Rp" + (subtotal + 10000).toLocaleString("id-ID");
            }

            if (couponMessage) {
              couponMessage.style.color = "#e74c3c";
              couponMessage.innerText =
                kodeUser === "" ? "" : "Kode kupon tidak valid! ❌";
              couponMessage.style.display = kodeUser === "" ? "none" : "block";
            }
          }
        }
      });
    }
  }
}

/* ========================================= */
/* REMOVE ITEM */
/* ========================================= */

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("Produk dihapus dari cart");

  setTimeout(() => {
    location.reload();
  }, 800);
}

/* ========================================= */
/* CHECKOUT PAGE */
/* ========================================= */

const checkoutItems = document.getElementById("checkout-cart-items");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutTotal = document.getElementById("checkout-total");

if (checkoutItems) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;
  checkoutItems.innerHTML = "";

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    checkoutItems.innerHTML += `
      <div class="checkout-cart-item">
        <img src="${item.image}">
        <div class="checkout-cart-info">
          <h4>${item.name}</h4>
          <p>Size: ${item.size}</p>
          <p>Qty: ${item.quantity}</p>
          <strong>Rp${(item.price * item.quantity).toLocaleString("id-ID")}</strong>
        </div>
      </div>
    `;
  });

  if (checkoutSubtotal) {
    checkoutSubtotal.innerText = "Rp" + subtotal.toLocaleString("id-ID");
  }

  
  let savedDiscount = parseFloat(localStorage.getItem("appliedDiscount")) || 0;
  const checkoutDiscountRow = document.getElementById("discount-row");
  const checkoutDiscountAmount = document.getElementById("discount-amount");

  if (savedDiscount > 0 && checkoutDiscountRow) {
    checkoutDiscountRow.style.display = "flex";
    checkoutDiscountAmount.innerText =
      "-Rp" + savedDiscount.toLocaleString("id-ID");
  } else if (checkoutDiscountRow) {
    checkoutDiscountRow.style.display = "none";
  }

  if (checkoutTotal) {
    let finalCheckoutTotal = subtotal - savedDiscount + 10000; 
    checkoutTotal.innerText =
      "Rp" +
      (finalCheckoutTotal < 0 ? 0 : finalCheckoutTotal).toLocaleString("id-ID");
  }
}

/* ========================================= */
/* SHIPPING PAGE */
/* ========================================= */

const shippingCards = document.querySelectorAll(".shipping-card");
const shippingSubtotal = document.getElementById("shipping-subtotal");
const shippingPrice = document.getElementById("shipping-price");
const shippingTotal = document.getElementById("shipping-total");
const shippingCartItems = document.getElementById("shipping-cart-items");

if (shippingCartItems) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;
  shippingCartItems.innerHTML = "";

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    shippingCartItems.innerHTML += `
      <div class="checkout-cart-item">
        <img src="${item.image}">
        <div class="checkout-cart-info">
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity}</p>
          <strong>Rp${(item.price * item.quantity).toLocaleString("id-ID")}</strong>
        </div>
      </div>
    `;
  });

  let currentShipping = 10000;
  localStorage.setItem("shippingCost", currentShipping); 
  let savedDiscount = parseFloat(localStorage.getItem("appliedDiscount")) || 0;


  const shippingDiscountRow = document.getElementById("discount-row");
  const shippingDiscountAmount = document.getElementById("discount-amount");

  if (shippingSubtotal) {
    shippingSubtotal.innerText = "Rp" + subtotal.toLocaleString("id-ID");
  }

  if (savedDiscount > 0 && shippingDiscountRow) {
    shippingDiscountRow.style.display = "flex";
    shippingDiscountAmount.innerText =
      "-Rp" + savedDiscount.toLocaleString("id-ID");
  }

  if (shippingPrice) {
    shippingPrice.innerText = "Rp" + currentShipping.toLocaleString("id-ID");
  }

  if (shippingTotal) {
    let finalShippingTotal = subtotal - savedDiscount + currentShipping;
    shippingTotal.innerText =
      "Rp" +
      (finalShippingTotal < 0 ? 0 : finalShippingTotal).toLocaleString("id-ID");
  }

  shippingCards.forEach((card) => {
    card.addEventListener("click", () => {
      shippingCards.forEach((c) => {
        c.classList.remove("active-shipping");
      });

      card.classList.add("active-shipping");
      currentShipping = parseInt(card.dataset.price);
      localStorage.setItem("shippingCost", currentShipping); 

      if (shippingPrice) {
        shippingPrice.innerText =
          "Rp" + currentShipping.toLocaleString("id-ID");
      }

      if (shippingTotal) {
        let finalShippingTotal = subtotal - savedDiscount + currentShipping;
        shippingTotal.innerText =
          "Rp" +
          (finalShippingTotal < 0 ? 0 : finalShippingTotal).toLocaleString(
            "id-ID",
          );
      }
    });
  });
}

/* ========================================= */
/* PAYMENT PAGE */
/* ========================================= */

const paymentCards = document.querySelectorAll(".payment-card");
const paymentDetail = document.getElementById("payment-detail");
const paymentCartItems = document.getElementById("payment-cart-items");
const paymentSubtotal = document.getElementById("payment-subtotal");
const paymentTotal = document.getElementById("payment-total");

/* PAYMENT CART */
if (paymentCartItems) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;
  paymentCartItems.innerHTML = "";

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    paymentCartItems.innerHTML += `
      <div class="checkout-cart-item">
        <img src="${item.image}">
        <div class="checkout-cart-info">
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity}</p>
          <strong>Rp${(item.price * item.quantity).toLocaleString("id-ID")}</strong>
        </div>
      </div>
    `;
  });

  let savedDiscount = parseFloat(localStorage.getItem("appliedDiscount")) || 0;
  const paymentDiscountRow = document.getElementById("discount-row");
  const paymentDiscountAmount = document.getElementById("discount-amount");

  
  let savedShipping = parseInt(localStorage.getItem("shippingCost")) || 10000;

  if (paymentSubtotal) {
    paymentSubtotal.innerText = "Rp" + subtotal.toLocaleString("id-ID");
  }

  
  const summaryLines = document.querySelectorAll(
    ".payment-right .summary-line",
  );
  if (summaryLines.length >= 2) {
    const shippingSpan = summaryLines[1].querySelectorAll("span")[1];
    if (shippingSpan) {
      shippingSpan.innerText = "Rp" + savedShipping.toLocaleString("id-ID");
    }
  }

  if (savedDiscount > 0 && paymentDiscountRow) {
    paymentDiscountRow.style.display = "flex";
    paymentDiscountAmount.innerText =
      "-Rp" + savedDiscount.toLocaleString("id-ID");
  }

  if (paymentTotal) {
   
    let finalPaymentTotal = subtotal - savedDiscount + savedShipping;
    paymentTotal.innerText =
      "Rp" +
      (finalPaymentTotal < 0 ? 0 : finalPaymentTotal).toLocaleString("id-ID");
  }
}

/* PAYMENT METHOD */
if (paymentCards.length > 0) {
  paymentCards.forEach((card) => {
    card.addEventListener("click", () => {
      paymentCards.forEach((c) => {
        c.classList.remove("active-payment");
      });

      card.classList.add("active-payment");
      const method = card.dataset.method;

      if (!paymentDetail) return;

      if (method === "bca") {
        paymentDetail.innerHTML = `
          <h3>Transfer Bank BCA</h3>
          <p>Masukkan nomor rekening tujuan:</p>
          <input type="text" placeholder="Contoh: 1234567890" class="payment-input">
          <p>Atas Nama:</p>
          <input type="text" placeholder="Nama Pemilik Rekening" class="payment-input">
        `;
      } else if (method === "dana") {
        paymentDetail.innerHTML = `
          <h3>Dana Payment</h3>
          <p>Masukkan nomor Dana:</p>
          <input type="text" placeholder="08xxxxxxxxxx" class="payment-input">
          <p>Atas Nama:</p>
          <input type="text" placeholder="Nama Akun Dana" class="payment-input">
        `;
      } else if (method === "qris") {
        paymentDetail.innerHTML = `
          <h3>QRIS Payment</h3>
          <p>Scan QR berikut:</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=TanamanKuPayment" style="width:220px; margin-top:15px; border-radius:12px;">
        `;
      }
    });
  });
}

/* ================= SUCCESS PAGE ================= */

const orderId = document.getElementById("order-id");

if (orderId) {
  const randomId = "TRX" + Math.floor(Math.random() * 99999999);
  orderId.innerText = randomId;


  localStorage.removeItem("cart");
  localStorage.removeItem("appliedDiscount");
  updateCartCount();
}

/* ================= QUANTITY & SIZE UPDATE CART ================= */

function updateCartItemSize(index, newSize) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  let oldSizePrice = 0;
  if (cart[index].size === "M") oldSizePrice = 10000;
  if (cart[index].size === "L") oldSizePrice = 20000;

  const basePrice = cart[index].price - oldSizePrice;

  let newSizePrice = 0;
  if (newSize === "M") newSizePrice = 10000;
  if (newSize === "L") newSizePrice = 20000;

  cart[index].size = newSize;
  cart[index].price = basePrice + newSizePrice;

  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

function increaseQty(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

function decreaseQty(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

/* ================= USER SESSION ================= */

const loginBtn = document.getElementById("loginBtn");
const user = JSON.parse(localStorage.getItem("user"));

if (user && user.role === "admin") {
  const navLinks = document.querySelector(".nav-links");

  if (navLinks) {
    navLinks.innerHTML += `
      <li>
        <a href="admin.html">
          Admin Panel
        </a>
      </li>
    `;
  }
}

if (loginBtn && user) {
  loginBtn.innerHTML = `Logout (${user.username})`;
  loginBtn.href = "#";

  loginBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    alert("Logout berhasil");
    location.reload();
  });
}

const adminBtn = document.getElementById("adminBtn");

if (adminBtn && user && user.role === "admin") {
  adminBtn.style.display = "inline-block";
}
