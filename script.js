
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

async function loadFoods() {
  try {

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

async function addToCart(name, price, image) {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Login first ");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("https://food-app-7r0i.onrender.com/addcart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: currentUser,
        foodName: name,
        price: price,
        image: image
      })
    });

    const text = await res.text();
    console.log(text);

    try {
      const data = JSON.parse(text);
      showToast();
      console.log(data.message);
    } catch {
      console.log("Not JSON response:", text);
      alert("Backend problem ");
    }

  } catch (err) {
    console.log(err);
    alert("Server error ");
  }
}

function showToast() {
  const toast = document.getElementById("toast");

  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}


// 🛒 UPDATE CART

// 🚀 START

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
    alert("You are not logged in ");
    return;
  }

  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}


function goToCart() {

const user = localStorage.getItem("currentUser");  

  if (!user) {
    alert("Please login first ");
    window.location.href = "login.html";
    return;
  }

  window.location.href = "cart.html";
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

