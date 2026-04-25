const feedbackList = document.getElementById("feedbackList");
const messageInput = document.getElementById("feedbackMessage");
const errorText = document.getElementById("errorText");

const currentUser = localStorage.getItem("currentUser");

let selectedRating = 5;

function setRating(value) {
  selectedRating = value;

  const stars = document.querySelectorAll(".star-rating span");

  stars.forEach((star, index) => {
    if (index < value) {
      star.style.opacity = "1";
    } else {
      star.style.opacity = "0.3";
    }
  });
}

async function submitFeedback() {
  const message = messageInput.value.trim();

  errorText.innerText = "";

  if (!currentUser) {
    errorText.innerText = "Please login ";
    return;
  }

  if (!message) {
    errorText.innerText = "Please write feedback ";
    return;
  }

  try {
    await fetch("https://food-app-7r0i.onrender.com/addfeedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: currentUser,
        message: message,
        rating: selectedRating
      })
    });

   messageInput.value = "";
selectedRating = 5;
setRating(5);

await loadFeedbacks();


  } catch (err) {
    console.log(err);
    errorText.innerText = "Feedback failed";
  }
}

async function loadFeedbacks() {
  try {
    const res = await fetch("https://food-app-7r0i.onrender.com/feedbacks");

    const data = await res.json();

    console.log("Feedbacks:", data);

    feedbackList.innerHTML = "";

    if (data.length === 0) {
      feedbackList.innerHTML = "<p>No feedback yet </p>";
      return;
    }

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "feedback-card";

      div.innerHTML = `
        <div class="review-top">
          <h3>${item.username}</h3>
          <p>${"⭐".repeat(item.rating || 5)}</p>
        </div>

        <p class="review-message">${item.message}</p>

        <button onclick="deleteFeedback('${item._id}')">
    🗑 Delete
  </button>
      `;

      feedbackList.appendChild(div);
    });

  } catch (err) {
    console.log("Feedback loading error:", err);
  }
}
setRating(5);
loadFeedbacks();


async function deleteFeedback(id) {
  console.log("Deleting ID:", id);

  try {
    const res = await fetch(
      `https://food-app-7r0i.onrender.com/feedback/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await res.json();
    console.log(data);

    loadFeedbacks();

  } catch (err) {
    console.log(err);
    alert("Delete failed ");
  }
}