import React, { useState } from "react";
import axios from "axios";
import IngredientTags from "./IngredientTags";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; // Firebase logout

function RecipeFinder() {
  const [inputText, setInputText] = useState("");
  const [inputList, setInputList] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

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
      const response = await axios.post('https://leftover-chef.onrender.com/api/find', {
        ingredients,
      });
      setResults(response.data);
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leftover Chef</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Logout
        </button>
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
