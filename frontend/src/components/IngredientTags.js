import React from "react";

const IngredientTags = ({ inputList, removeIngredient }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {inputList.map((ingredient, index) => (
        <div
          key={index}
          className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
        >
          {ingredient}
          <button
            onClick={() => removeIngredient(index)}
            className="ml-2 text-red-500 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default IngredientTags;
