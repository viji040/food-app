
let currentUser = localStorage.getItem("currentUser");
let allFoods = [];
const profile = document.getElementById("profile");
const logoutBtn = document.querySelector("button[onclick='logout()']");

if (currentUser) {
  if (profile) profile.innerText = currentUser;
  if (logoutBtn) logoutBtn.style.display = "block";
} else {
  if (profile) profile.innerText = "Guest";
  if (logoutBtn) logoutBtn.style.display = "none";
}

const foodList = document.getElementById("food-list");
const searchInput = document.getElementById("searchBox");
let selectedItems = [];

let cart = JSON.parse(localStorage.getItem(currentUser + "_cart")) || [];

// function getImage(food) {
//   const text = (food.name + " " + food.category).toLowerCase();

//   // 👇 SPECIFIC FIRST
//   if (text.includes("chicken pizza")) return "/images/chickenpizza.jpg";
//   if (text.includes("grill")) return "/images/grill.jpg";
//   if (text.includes("samosa")) return "/images/samosa.jpg";
//   if (text.includes("fries")) return "/images/fries.jpg";
//   if (text.includes("fruits")) return "/images/fruits.jpg";
//   // if (text.includes("drinks")) return "/images/drinks.jpg";
//   if (text.includes("juice") || text.includes("drink"))
//   return "/images/fruits.jpg";
//   if (text.includes("biriyani") || text.includes("vegbiriyani"))
//   return "/images/vegbiriyani.jpg";

//   // 👇 GENERAL LAST
//   if (text.includes("pizza")) return "/images/pizza.jpg";
//   if (text.includes("burger")) return "/images/burger.jpg";
//   if (text.includes("biriyani")) return "/images/biriyani.jpg";

//   return "images/biriyani.jpg";
// }
// 🚀 FETCH
// let allFoods = [
//   { name: "Chicken Biryani", price: 180, veg: false, category: "main" },
//   { name: "Veg Pizza", price: 120, veg: true, category: "main" },
//   { name: "Paneer Burger", price: 90, veg: true, category: "snack" },
//   { name: "Chicken Pizza", price: 150, veg: false, category: "main" },
//   { name: "French Fries", price: 60, veg: true, category: "snack" },
//   { name: "Samosa", price: 20, veg: true, category: "snack" },
//   { name: "Grill Chicken", price: 200, veg: false, category: "main" },
//    { name: "fruit juice", price: 80, veg: true, category: "snack" },
//    { name: "veg biriyani", price: 100, veg: true, category: "main" }
// ];

async function loadFoods() {
  try {
    // const res = await fetch("http://localhost:5000/foods");
    const res= await fetch("https://food-app-7r0i.onrender.com/foods")
    const data = await res.json();

    console.log("Foods from DB:", data);

    allFoods = data;   // 🔥 store DB data
    displayFoods(allFoods);

  } catch (err) {
    console.log("Error fetching foods:", err);
  }
}

loadFoods();

// 🔍 SEARCH + FILTER
searchInput.addEventListener("input", filterFoods);

function filterFoods() {
  const value = searchInput.value.toLowerCase();

  const filtered = allFoods.filter(food =>
    food.name.toLowerCase().includes(value)
  );

  displayFoods(filtered);
}

// 🟢 VEG FILTER
function showVeg() {
  const vegFoods = allFoods.filter(f => f.veg === true);
  displayFoods(vegFoods);
}

// 🔴 NON VEG FILTER
function showNonVeg() {
  const nonVegFoods = allFoods.filter(f => f.veg === false);
  displayFoods(nonVegFoods);
}

// 🚀 DISPLAY
function displayFoods(foods) {
  foodList.innerHTML = "";

  foods.forEach(food => {
    const div = document.createElement("div");
    div.className = "card";

    // const image = food.image;

    const image = "https://food-app-7r0i.onrender.com" + food.image;

    div.innerHTML = `
      

      <img src="${image || '/images/biriyani.jpg'}">
      <h3>${food.name}</h3>
      <p>₹${food.price}</p>
      <button onclick="addToCart('${food.name}', ${food.price},'${image}')">Add</button>
    `;

    foodList.appendChild(div);
  });
}

function addToCart(name, price, image) {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Login first 😒");
    window.location.href = "login.html";
    return;
  }


let cart = [];

if (currentUser) {
  cart = JSON.parse(localStorage.getItem(currentUser + "_cart")) || [];
}

  cart.push({ name, price, image });


  localStorage.setItem(currentUser + "_cart", JSON.stringify(cart));

  alert("Added to cart 😏");
}


function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart_" + user, JSON.stringify(cart));
  updateCart();
}

// 🛒 UPDATE CART
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${item.name} - ₹${item.price}
      <button onclick="removeItem(${index})">❌</button>
    `;

    cartItems.appendChild(li);
    total += item.price;
  });

  totalEl.textContent = "Total: ₹" + total;
}

function placeOrder() {
  if (cart.length === 0) {
    alert("Cart empty 😒");
    return;
  }

  alert("Order placed successfully 🎉");

  cart = [];
 
  
localStorage.removeItem(currentUser + "_cart");
  updateCart();
}

// 🚀 START
// getFoods();


function toggleMenu() {
  document.getElementById("sideMenu").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeMenu() {
  document.getElementById("sideMenu").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

// show all
function showAll() {
  displayFoods(allFoods);
}

function logout() {
  if (!currentUser) {
    alert("You are not logged in 😒");
    return;
  }

  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}


function goToCart() {

const user = localStorage.getItem("currentUser");  

  if (!user) {
    alert("Please login first 😒");
    window.location.href = "login.html";
    return;
  }

  window.location.href = "cart.html";
}

if (document.getElementById("cart-items")) {
  updateCart();
}

function toggleSelect(index) {
  if (selectedItems.includes(index)) {
    selectedItems = selectedItems.filter(i => i !== index);
  } else {
    selectedItems.push(index);
  }
}
if (searchInput) {
  searchInput.addEventListener("input", filterFoods);
}

