const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const recipeResults = document.querySelector("#recipe-results");
const favoriteResults = document.querySelector("#favorite-results");
const recipeModal = document.querySelector("#recipe-modal");
const detailsContent = document.querySelector("#details-content");
const closeModal = document.querySelector("#close-modal");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentMeals = [];

const displayFavorites = () => {
  if (favorites.length === 0) {
    favoriteResults.innerHTML =
      "<p>Your saved recipes will appear here.</p>";
    return;
  }

  favoriteResults.innerHTML = favorites.map((meal) => `
    <article class="recipe-card">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
      <p>${meal.strArea || "Cuisine not specified"}</p>

      <button class="view-recipe" data-id="${meal.idMeal}">
        View Recipe
      </button>

      <button class="remove-favorite" data-id="${meal.idMeal}">
        Remove Favorite
      </button>
    </article>
  `).join("");
};

displayFavorites();

const searchRecipes = async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    return;
  }

  recipeResults.innerHTML = "<p>Searching for recipes...</p>";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
    );
    
    if (!response.ok) {
    throw new Error("Unable to fetch recipes");
    }

    const { meals } = await response.json();


    if (!meals) {
      recipeResults.innerHTML = "<p>No recipes found. Try another search!</p>";
      return;
    }

    currentMeals = meals;

    recipeResults.innerHTML = meals.map((meal) => `
    <article class="recipe-card">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea || "Cuisine not specified"}</p>
        <button class="view-recipe" data-id="${meal.idMeal}">
        View Recipe
        </button>
        <button class="favorite-button" data-id="${meal.idMeal}">
        Add to Favorites
        </button>
    </article>
    `).join("");

  } catch (error) {
    recipeResults.innerHTML =
      "<p>Something went wrong. Please try again.</p>";
    console.error("Error fetching recipes:", error);
  }
};

searchForm.addEventListener("submit", searchRecipes);

recipeResults.addEventListener("click", (event) => {
  if (event.target.classList.contains("favorite-button")) {
    const mealId = event.target.dataset.id;

    const selectedMeal = currentMeals.find(
      (meal) => meal.idMeal === mealId
    );

    const alreadySaved = favorites.some(
      (meal) => meal.idMeal === mealId
    );

    if (selectedMeal && !alreadySaved) {
      const { idMeal, strMeal, strMealThumb, strArea } = selectedMeal;

      favorites.push({ idMeal, strMeal, strMealThumb, strArea });

      localStorage.setItem("favorites", JSON.stringify(favorites));

      displayFavorites();

      event.target.textContent = "Added!";
    } else if (alreadySaved) {
      event.target.textContent = "Already saved";
    }
  }
});

favoriteResults.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-favorite")) {
    const mealId = event.target.dataset.id;

    favorites = favorites.filter(
      (meal) => meal.idMeal !== mealId
    );

    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayFavorites();
  }
});

document.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("view-recipe")) {
    return;
  }

  const mealId = event.target.dataset.id;

  recipeModal.hidden = false;
  detailsContent.innerHTML = "<p>Loading recipe...</p>";
  closeModal.focus();

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );

    if (!response.ok) {
      throw new Error("Unable to load recipe");
    }

    const { meals } = await response.json();
    const [meal] = meals;

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(
          `<li>${measure || ""} ${ingredient}</li>`
        );
      }
    }

    document.querySelector("#details-title").textContent =
      meal.strMeal;

    detailsContent.innerHTML = `
      <h3>Ingredients</h3>
      <ul>${ingredients.join("")}</ul>
      <h3>Instructions</h3>
      <p>${meal.strInstructions.replace(/\r?\n/g, "<br>")}</p>
    `;
  } catch (error) {
    detailsContent.innerHTML =
      "<p>Sorry, we couldn't load this recipe. Please try again.</p>";

    console.error("Error loading recipe:", error);
  }
});

closeModal.addEventListener("click", (event) => {
  event.preventDefault();
  recipeModal.hidden = true;
});

recipeModal.addEventListener("click", (event) => {
  if (event.target === recipeModal) {
    recipeModal.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !recipeModal.hidden) {
    recipeModal.hidden = true;
  }
});