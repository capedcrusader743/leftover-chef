// src/pages/AddRecipe.js

import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../pages/firebase'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!title || !description || !ingredients || !steps) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Convert comma-separated ingredients/steps to arrays
      const ingredientList = ingredients.split(',').map(item => item.trim());
      const stepList = steps.split('\n').map(item => item.trim());

      await addDoc(collection(db, 'recipes'), {
        title,
        description,
        ingredients: ingredientList,
        steps: stepList,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        public: isPublic,
      });

      // Redirect to home or recipes page after submission
      navigate('/home');
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError('Failed to submit recipe. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Your Recipe</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Steps (one step per line)"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="w-full border p-2 rounded h-32"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label>Make this recipe public</label>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
