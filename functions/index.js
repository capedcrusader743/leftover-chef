const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 4000; // Render sets PORT automatically
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

const allowedOrigins = [
  "https://localhost:3000",
  "https://leftover-chef-1044f.web.app",
  "https://leftover-chef-1044f.firebaseapp.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

app.post('/api/find', async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const query = ingredients.join(',');

  try {
    const searchResponse = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients: query,
        number: 5,
        ranking: 1,
        ignorePantry: true,
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    const recipes = searchResponse.data;

    const detailedResults = await Promise.all(
      recipes.map((recipe) =>
        axios
          .get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
            params: { apiKey: SPOONACULAR_API_KEY },
          })
          .then((res) => ({
            title: res.data.title,
            image: res.data.image,
            sourceUrl: res.data.sourceUrl,
          }))
      )
    );

    const finalRecipes = detailedResults.map((res, index) => ({
      title: res.title,
      image: res.image,
      sourceUrl: res.sourceUrl,
      usedIngredients: recipes[index].usedIngredients.map((ing) => ing.name),
    }));

    res.json(finalRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// 🔥 Key change: Listen on PORT (Render handles the port injection)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
