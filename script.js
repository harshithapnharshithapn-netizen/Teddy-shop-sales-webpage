// Product details live in one place so the cards, cart and checkout stay in sync.
const products = [
  {
    id: "classic-brown",
    name: "Classic Brown Teddy",
    price: 799,
    oldPrice: 999,
    categories: ["medium", "gift"],
    description: "A timeless, squishy friend for everyday hugs.",
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=80",
    badge: "20% OFF",
    rating: "4.9"
  },
  {
    id: "pink-love",
    name: "Pink Love Teddy",
    price: 899,
    oldPrice: 1099,
    categories: ["medium", "gift"],
    description: "A rosy-cheeked bear with a whole lot of love.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=700&q=80",
    badge: "BESTSELLER",
    rating: "5.0"
  },
  {
    id: "giant-teddy",
    name: "Giant Teddy Bear",
    price: 2499,
    oldPrice: 2999,
    categories: ["large"],
    description: "An extra-large cuddle buddy for big feelings.",
    image: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=700&q=80",
    badge: "₹500 OFF",
    rating: "4.9"
  },
  {
    id: "white-teddy",
    name: "Cute White Teddy",
    price: 699,
    oldPrice: null,
    categories: ["small"],
    description: "A fluffy little cloud you can take anywhere.",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=80",
    badge: null,
    rating: "4.8"
  },
  {
    id: "heart-teddy",
    name: "Heart-Holding Teddy",
    price: 1199,
    oldPrice: 1399,
    categories: ["medium", "gift"],
    description: "A sweet surprise for someone close to your heart.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=700&q=80",
    badge: "GIFT PICK",
    rating: "4.9"
  },
  {
    id: "mini-teddy",
    name: "Mini Teddy",
    price: 349,
    oldPrice: null,
    categories: ["small"],
    description: "A pocket-sized pal for your desk or backpack.",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=700&q=80",
    badge: null,
    rating: "4.8"
  },
  {
    id: "birthday-teddy",
    name: "Birthday Teddy",
    price: 999,
    oldPrice: 1199,
    categories: ["medium", "gift"],
    description: "Bring the party with a bear made for birthdays.",
    image: "https://images.unsplash.com/photo-1599623560574-39d485900c95?auto=format&fit=crop&w=700&q=80",
    badge: "GIFT PICK",
    rating: "4.9"
  },
  {
    id: "couple-teddies",
    name: "Premium Couple Teddy Bears",
    price: 1899,
    oldPrice: 2299,
    categories: ["large", "gift"],
    description: "Two cuddly companions, wrapped up as a pair.",
    image: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=700&q=80",
    badge: "PAIR & SAVE",
    rating: "5.0"
  }
];

const CART_STORAGE_KEY = "teddy-paradise-cart";
const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const productGrid = document.querySelector("#productGrid");
const productSearch = document.querySelector("#productSearch");
const filterButtons = document.querySelectorAll(".filter-button");
const resultsCount = document.querySelector("#resultsCount");
const emptySearch = document.querySelector("#emptySearch");
const cartDrawer = document.querySelector("#cartDrawer");
const drawerBackdrop = document.querySelector("#drawerBackdrop");
const cartItemsElement = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartSummary = document.querySelector("#cartSummary");
const cartCount = document.querySelector("#cartCount");
const cartNotice = document.querySelector("#cartNotice");
const checkoutDialog = document.querySelector("#checkoutDialog");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutContent = document.querySelector("#checkoutContent");
const orderSuccess = document.querySelector("#orderSuccess");

let selectedCategory = "all";
let cart = loadCart();

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(savedCart)) {
      throw new TypeError("Saved cart data is not a list.");
    }

    return savedCart.filter((item) => {
      return item
        && products.some((product) => product.id === item.id)
        && Number.isInteger(item.quantity)
        && item.quantity > 0
        && item.quantity <= 99;
    });
  } catch (error) {
    console.error("Could not read the saved Teddy Paradise cart.", error);
    cartNotice.textContent = "Your saved cart could not be read, so it has been started fresh.";
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    cartNotice.textContent = "";
  } catch (error) {
    console.error("Could not save the Teddy Paradise cart.", error);
    cartNotice.textContent = "Your browser could not save the cart. It may not stay after a refresh.";
  }
}

function makeImageFallback(image) {
  image.addEventListener("error", () => {
    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.setAttribute("aria-hidden", "true");
    fallback.textContent = "🧸";
    image.replaceWith(fallback);
  }, { once: true });
}

function renderProducts() {
  const searchTerm = productSearch.value.trim().toLocaleLowerCase();
  const matchingProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.categories.includes(selectedCategory);
    const matchesSearch = product.name.toLocaleLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  productGrid.replaceChildren();
  matchingProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    makeImageFallback(image);
    imageWrap.append(image);

    if (product.badge) {
      const badge = document.createElement("span");
      badge.className = "discount-badge";
      badge.textContent = product.badge;
      imageWrap.append(badge);
    }

    const favorite = document.createElement("span");
    favorite.className = "favorite-badge";
    favorite.setAttribute("aria-hidden", "true");
    favorite.textContent = "♡";
    imageWrap.append(favorite);

    const info = document.createElement("div");
    info.className = "product-info";
    const meta = document.createElement("div");
    meta.className = "product-meta";
    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.categories.map((name) => name === "gift" ? "Gift" : name).join(" · ");
    const rating = document.createElement("span");
    rating.className = "product-rating";
    rating.textContent = `★ ${product.rating}`;
    meta.append(category, rating);

    const name = document.createElement("h3");
    name.textContent = product.name;
    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const buyRow = document.createElement("div");
    buyRow.className = "product-buy-row";
    const price = document.createElement("span");
    price.className = "price-current";
    price.textContent = rupees.format(product.price);
    if (product.oldPrice) {
      const oldPrice = document.createElement("span");
      oldPrice.className = "price-old";
      oldPrice.textContent = rupees.format(product.oldPrice);
      price.append(oldPrice);
    }

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";
    addButton.dataset.addProduct = product.id;
    addButton.setAttribute("aria-label", `Add ${product.name} to cart`);
    addButton.innerHTML = "<span aria-hidden=\"true\">+</span> Add to cart";
    buyRow.append(price, addButton);
    info.append(meta, name, description, buyRow);
    card.append(imageWrap, info);
    productGrid.append(card);
  });

  resultsCount.textContent = `${matchingProducts.length} ${matchingProducts.length === 1 ? "bear" : "bears"}`;
  emptySearch.hidden = matchingProducts.length !== 0;
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function renderCart() {
  cartItemsElement.replaceChildren();
  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) {
      return;
    }

    const row = document.createElement("article");
    row.className = "cart-item";
    const image = document.createElement("img");
    image.className = "cart-item-image";
    image.src = product.image;
    image.alt = "";
    image.loading = "lazy";
    makeImageFallback(image);

    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = product.name;
    const price = document.createElement("span");
    price.className = "cart-item-price";
    price.textContent = `${rupees.format(product.price)} each`;
    const quantity = document.createElement("div");
    quantity.className = "quantity-control";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.quantityChange = "-1";
    decrease.dataset.productId = product.id;
    decrease.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    decrease.textContent = "−";
    const quantityNumber = document.createElement("span");
    quantityNumber.textContent = item.quantity;
    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.quantityChange = "1";
    increase.dataset.productId = product.id;
    increase.setAttribute("aria-label", `Increase ${product.name} quantity`);
    increase.textContent = "+";
    quantity.append(decrease, quantityNumber, increase);
    details.append(name, price, quantity);

    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.type = "button";
    remove.dataset.removeProduct = product.id;
    remove.setAttribute("aria-label", `Remove ${product.name} from cart`);
    remove.textContent = "Remove";
    row.append(image, details, remove);
    cartItemsElement.append(row);
  });

  const subtotal = getCartSubtotal();
  cartCount.textContent = getCartQuantity();
  cartEmpty.hidden = cart.length > 0;
  cartSummary.hidden = cart.length === 0;
  document.querySelector("#cartSubtotal").textContent = rupees.format(subtotal);
  document.querySelector("#cartTotal").textContent = rupees.format(subtotal);
  document.querySelector("#openCheckout").disabled = cart.length === 0;
}

function updateCart() {
  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.body.classList.add("drawer-open");
  document.querySelector("#closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.body.classList.remove("drawer-open");
  document.querySelector("#openCart").focus();
}

function renderOrderPreview() {
  const orderItems = document.querySelector("#orderItems");
  orderItems.replaceChildren();
  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) {
      return;
    }
    const row = document.createElement("div");
    row.className = "preview-item";
    const name = document.createElement("span");
    name.textContent = `${product.name} × ${item.quantity}`;
    const price = document.createElement("strong");
    price.textContent = rupees.format(product.price * item.quantity);
    row.append(name, price);
    orderItems.append(row);
  });
  const subtotal = rupees.format(getCartSubtotal());
  document.querySelector("#orderSubtotal").textContent = subtotal;
  document.querySelector("#orderTotal").textContent = subtotal;
}

function resetCheckout() {
  checkoutForm.reset();
  checkoutContent.hidden = false;
  orderSuccess.hidden = true;
}

productSearch.addEventListener("input", renderProducts);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    filterButtons.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    renderProducts();
  });
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-product]");
  if (!button) {
    return;
  }

  const productId = button.dataset.addProduct;
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    if (existingItem.quantity < 99) {
      existingItem.quantity += 1;
    } else {
      cartNotice.textContent = "A maximum of 99 of each bear can be added.";
      openCart();
      return;
    }
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  updateCart();
  openCart();
});

cartItemsElement.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity-change]");
  const removeButton = event.target.closest("[data-remove-product]");

  if (removeButton) {
    cart = cart.filter((item) => item.id !== removeButton.dataset.removeProduct);
    updateCart();
    return;
  }

  if (quantityButton) {
    const item = cart.find((entry) => entry.id === quantityButton.dataset.productId);
    if (!item) {
      return;
    }
    const change = Number(quantityButton.dataset.quantityChange);
    if (change > 0 && item.quantity >= 99) {
      cartNotice.textContent = "A maximum of 99 of each bear can be added.";
      return;
    }
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((entry) => entry.id !== item.id);
    }
    updateCart();
  }
});

document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.querySelector("#browseBears").addEventListener("click", () => {
  closeCart();
  document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#openCheckout").addEventListener("click", () => {
  if (cart.length === 0) {
    return;
  }
  renderOrderPreview();
  checkoutDialog.showModal();
  document.querySelector("#customerName").focus();
});

document.querySelector("#closeCheckout").addEventListener("click", () => checkoutDialog.close());
document.querySelector("#finishOrder").addEventListener("click", () => checkoutDialog.close());

checkoutDialog.addEventListener("close", resetCheckout);
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!checkoutForm.reportValidity() || cart.length === 0) {
    return;
  }

  const customerName = document.querySelector("#customerName").value.trim();
  document.querySelector("#successMessage").textContent = `Thanks, ${customerName}! Your pretend cuddle crew is ready.`;
  cart = [];
  updateCart();
  closeCart();
  checkoutContent.hidden = true;
  orderSuccess.hidden = false;
  document.querySelector("#finishOrder").focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) {
    closeCart();
  }
  if (event.key === "/" && !checkoutDialog.open && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    productSearch.focus();
  }
});

document.querySelector("#currentYear").textContent = new Date().getFullYear();
renderProducts();
renderCart();
