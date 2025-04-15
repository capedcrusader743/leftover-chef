const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

const recipes = require('./recipes.json'); // or hardcode for now

app.use(cors());
app.use(express.json());

app.post('/api/find', (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const matched = recipes.filter(recipe => {
    const matchCount = recipe.ingredients.filter(i =>
      ingredients.includes(i.toLowerCase())
    ).length;
    return matchCount >= 2;
  });

  res.json(matched);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
