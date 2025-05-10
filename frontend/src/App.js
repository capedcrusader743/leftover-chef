import React, { useState } from "react";
import axios from "axios";
import IngredientTags from "./components/IngredientTags";

function App() {
  const [inputText, setInputText] = useState("");
  const [inputList, setInputList] = useState([]);
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    if (!inputText.trim()) return;

    const newIngredients = inputText
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i !== "");

    const updatedList = Array.from(new Set([...inputList, ...newIngredients]));
    
    setInputList(updatedList);
    setInputText("");

    axios.post("http://localhost:4000/api/find", {
      ingredients: updatedList,
    })
    .then((res) => {
      setResults(res.data);
    })
    .catch((err) => console.error(err));
  };

  const removeIngredient = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
    setResults([]);

    if (newList.length > 0) {
      axios.post("http://localhost:4000/api/find", {
        ingredients: newList,
      })
      .then((res) => setResults(res.data))
      .catch((err) => console.error(err));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Leftover Chef</h1>

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
        {results.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Recipes:</h2>
            <ul className="list-disc ml-6">
            {results.map((recipe, index) => (
              <li key={index}>
                <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {recipe.title}
                </a>
              </li>
            ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;