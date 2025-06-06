import React, { useState } from "react";
import axios from "axios";
import IngredientTags from "./IngredientTags";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"; // Firebase logout
import { collection, getDocs, addDoc } from "firebase/firestore"; // Firebase Firestore
import { auth, db } from "../pages/firebase"; // Firebase initialization
import { Link } from "react-router-dom"; // For navigation


function RecipeFinder() {
  const [inputText, setInputText] = useState("");
  const [inputList, setInputList] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  const saveToFavorites = async (recipe) => {
    const user = auth.currentUser;
    if (!user) return;
  
    const recipeId = recipe.id || recipe.recipeId || recipe.title; // fallback
  
    if (!recipeId) {
      console.error("Recipe ID missing:", recipe);
      return;
    }
  
    try {
      await addDoc(collection(db, "favorites"), {
        uid: user.uid,
        id: recipeId,
        title: recipe.title,
        sourceUrl: recipe.sourceUrl,
        // image: recipe.image, // only if you can afford the image plan
      });
      alert("Recipe saved to favorites!");
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to signin page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchRecipes = async (ingredients) => {
    setLoading(true);
    try {
      // 1. Fetch from your API
      const response = await axios.post("https://leftover-chef.onrender.com/api/find", {
        ingredients,
      });

      const apiRecipes = response.data;

      // 2. Fetch custom recipes from Firestore
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const firebaseRecipes = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.ingredients) {
          const recipeIngredients = data.ingredients.map((i) => i.toLowerCase());
          const hasMatch = ingredients.some((ing) => recipeIngredients.includes(ing));
          if (hasMatch) {
            firebaseRecipes.push({
              ...data,
              id: doc.id,
              sourceUrl: "#", // placeholder if no link
              image: data.image || "https://via.placeholder.com/150", // fallback image
            });
          }
        }
      });

      // 3. Combine both sources
      const combinedResults = [...apiRecipes, ...firebaseRecipes];
      setResults(combinedResults);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = () => {
    if (!inputText.trim()) return;

    const newIngredients = inputText
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i !== "");

    const updatedList = Array.from(new Set([...inputList, ...newIngredients]));

    setInputList(updatedList);
    setInputText("");
    fetchRecipes(updatedList);
  };

  const removeIngredient = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
    setResults([]);

    if (newList.length > 0) {
      fetchRecipes(newList);
    }
  };



  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4 space-x-2">
        <h1 className="text-2xl font-bold">Leftover Chef</h1>
        <div className="flex space-x-2">
          <Link
            to="/add-recipe"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
          >
             Add Recipe
          </Link>
          <Link
            to="/favorites"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
          >
            View Favorites
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>


      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
        placeholder="Enter ingredients (comma separated)..."
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleSearch}
        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
      >
        Find Recipes
      </button>

      <IngredientTags inputList={inputList} removeIngredient={removeIngredient} />

      <div className="mt-6">
        {loading ? (
          <div className="text-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Finding delicious recipes...</p>
          </div>
        ) : (
          results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">🍽️ Recipes Found</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((recipe, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition duration-200"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                    <a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      View Recipe →
                    </a>
                    <button
                      onClick={() => saveToFavorites(recipe)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      ❤️ Save to Favorites
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default RecipeFinder;
