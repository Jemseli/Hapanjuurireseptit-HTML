async function fetchRandomRecipe() {
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        const meal = data.meals[0];

        document.getElementById('recipe-name').textContent = meal.strMeal;
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
    } catch (error) {
        console.error('Reseptin lataus epäonnistui:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRandomRecipe);

