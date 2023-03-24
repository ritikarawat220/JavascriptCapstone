
import getMealInfo from "./mealinfo.js";
import fetchLikes from "./like.js";


const foodItemsDiv = document.getElementById("list-meal");

// event listeners
foodItemsDiv.addEventListener("click", getMealInfo);

const displayFoods = () => {
  const likesData = JSON.parse(localStorage.getItem("likesData")) || {};
  
  fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=e")
    .then((res) => res.json())
    .then((data) => {
      let html = "";
      data.meals.forEach((meal) => {
        const likes = likesData[meal.idMeal] || 0;
        html += `
          <div class="meal-item" data-id="${meal.idMeal}"> 
            <div class="meal-img">     
              <img src="${meal.strMealThumb}">
            </div>
            <div class="meal-name">
              <div class="like-div">
                <p>${meal.strMeal}</p>
                <li class="like"><button class="like-btn"><i class="fa-regular fa-heart"></i></button></li>
              </div>
              <span class="like-count">${likes} Likes</span>
              <button class="comment">Comment</button>
            </div>
          </div>
        `;
      });

      foodItemsDiv.innerHTML = html;
      const likeButtons = document.querySelectorAll(".like-btn");
      likeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const mealId = btn.closest(".meal-item").getAttribute("data-id");
          fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/WxdOldIVe5Cky63nkl0B/likes/${mealId}/`, {method: "POST",
          body: JSON.stringify({ "item_id": "item1" }),
          headers: {
            "Content-Type": "application/json"
          }})
            .then((response) => response.json())
            .then((object) => {
              const likeCounter = btn.closest(".meal-item").querySelector(".like-count");
              let likes = parseInt(likeCounter.innerHTML);
              likes++;
              if (likes === 1) {
                likeCounter.innerHTML = `${likes} Like`;
              } else {
                likeCounter.innerHTML = `${likes} Likes`;
              }
              btn.style.backgroundColor = "red";
              fetchLikes(object);

              // Store the likes data in localStorage
              // const likesData = JSON.parse(localStorage.getItem("likesData")) || {};
              // likesData[mealId] = likes;
              // localStorage.setItem("likesData", JSON.stringify(likesData));
            });
        });
      });      
    });
};


export default displayFoods;