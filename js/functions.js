async function fetchRandomRecipe() {
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        const meal = data.meals[0];
        displayRecipe(meal);
    } catch (error) {
        console.error('Lataus epäonnistui', error);
    }
}

function displayRecipe(meal) {
    document.getElementById('recipe-title').textContent = meal.strMeal;
    document.getElementById('recipe-image').src = meal.strMealThumb;
    document.getElementById('recipe-image').alt = meal.strMeal;

    const instructionsText = meal.strInstructions;
    const instructionLines = instructionsText
        .split('. ')
        .filter(line => line.trim() !== '');

    const instructionsElement = document.getElementById('instructions');
    instructionsElement.innerHTML = '<ol>' +
        instructionLines.map(line => `<li>${line.trim()}.</li>`).join('') +
        '</ol>';

    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal['strIngredient' + i];
        const measure = meal['strMeasure' + i];

        if (ingredient && ingredient.trim() !== '') {
            const li = document.createElement('li');
            li.textContent = `${ingredient} – ${measure}`;
            ingredientsList.appendChild(li);
        }
    }

    const saveButton = document.getElementById('save-favorite');
    if (saveButton) {
        saveButton.onclick = () => saveFavorite(meal);
    }
}

function saveFavorite(meal) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const alreadySaved = favorites.some(r => r.idMeal === meal.idMeal);

    if (!alreadySaved) {
        favorites.push(meal);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Tallennettu suosikkeihisi!');
    } else {
        alert('Tämä resepti on jo tallennettu suosikkeihisi');
    }
}

function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>Et ole vielä tallentanut reseptejä suosikkeihisi</p>";
    } else {
        favoritesContainer.innerHTML = "";
        favorites.forEach(recipe => {
            const div = document.createElement('div');
            div.classList.add('favorite-item');
            div.innerHTML = `
                <h3>${recipe.strMeal}</h3>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="side-image">
            `;

            div.addEventListener('click', () => {
                localStorage.setItem('activeRecipe', JSON.stringify(recipe));
                window.location.href = 'recipe.html';
            });

            favoritesContainer.appendChild(div);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isRecipePage = document.getElementById('recipe-title');
    const isFavoritesPage = document.getElementById('favorites-container');
    const isIndexPageSidebar = document.getElementById('favorites-list');

    if (isRecipePage) {
        const activeRecipe = localStorage.getItem('activeRecipe');
        if (activeRecipe) {
            displayRecipe(JSON.parse(activeRecipe));
            localStorage.removeItem('activeRecipe');
        } else {
            fetchRandomRecipe();
        }

        const newRecipeButton = document.getElementById('recipe-button2');
        if (newRecipeButton) {
            newRecipeButton.addEventListener('click', fetchRandomRecipe);
        }
    }

    if (isFavoritesPage) {
        displayFavorites();
    }
});