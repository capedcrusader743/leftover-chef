const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 4000;

// const SPOONACULAR_API_KEY = '7c0dbb570f1d45778a8c2eb4c7aa1b3c';

app.use(cors());
app.use(express.json());

app.post('/api/recipe-links', async (req, res) => {
  const { foodName } = req.body;

  if (!foodName) {
    return res.status(400).json({ error: 'Missing food name' });
  }

  try {
    const searchQuery = `${foodName} recipe`;
    const serpApiKey = 'd684640749d41209e88577ad13875516847bb09d356d823e499a8cc5f51d9265'; // Replace with your actual key

    const serpResponse = await axios.get('https://serpapi.com/search.json', {
      params: {
        q: searchQuery,
        api_key: serpApiKey,
      },
    });

    const topResult = serpResponse.data.organic_results?.[0];
    if (topResult && topResult.link) {
      res.json({ title: topResult.title, link: topResult.link });
    } else {
      res.status(404).json({ error: 'No recipe link found' });
    }

  } catch (error) {
    console.error('Error fetching from SerpAPI:', error.message);
    res.status(500).json({ error: 'Failed to fetch recipe link' });
  }
});


// app.post('/api/find', async (req, res) => {
//   const { ingredients } = req.body;

//   if (!ingredients || !Array.isArray(ingredients)) {
//     return res.status(400).json({ error: 'Invalid input' });
//   }

//   const query = ingredients.join(',');

//   try {
//     // Step 1: Get recipes by ingredients
//     const searchResponse = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
//       params: {
//         ingredients: query,
//         number: 10,
//         ranking: 1,
//         ignorePantry: true,
//         apiKey: SPOONACULAR_API_KEY,
//       },
//     });

//     const recipes = searchResponse.data;

//     // Step 2: Fetch detailed info for each recipe
//     const detailedResults = await Promise.all(
//       recipes.map((recipe) =>
//         axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
//           params: { apiKey: SPOONACULAR_API_KEY },
//         })
//       )
//     );


//     // Step 3: Filter only trusted domains
//     const allowedDomains = ['allrecipes.com', 'foodnetwork.com', 'bbcgoodfood.com', 'delish.com'];

//     const finalRecipes = detailedResults.map((res) => {
//       const title = res.data.title;
//       return {
//         title,
//         image: res.data.image,
//         sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(title + ' recipe')}`
//       };
//     });
    

//     res.json(finalRecipes);
//   } catch (error) {
//     console.error('Error fetching recipes:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to fetch recipes' });
//   }
// });


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
