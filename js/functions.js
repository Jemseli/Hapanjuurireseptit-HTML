async function fetchRandomRecipe() {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    const meal = data.meals[0];

    document.getElementById('recipe-name').textContent = meal.strMeal;
    document.getElementById('recipe-image').src = meal.strMealThumb;
    document.getElementById('recipe-image').alt = meal.strMeal;
    document.getElementById('instructions').textContent = meal.strInstructions;

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
}

document.addEventListener('DOMContentLoaded', fetchRandomRecipe);
