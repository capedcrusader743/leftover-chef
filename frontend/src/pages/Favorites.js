import React, { useEffect, useState } from 'react';
import { auth, db } from '../pages/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesRef = collection(db, 'favorites');
        const snapshot = await getDocs(favoritesRef);
        const favoritesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Saved Recipes</h2>
          <Link to="/home" className="text-blue-600 hover:underline">← Back to Search</Link>
        </div>

        {favorites.length === 0 ? (
          <p className="text-gray-600 text-lg">You haven’t saved any recipes yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                  <a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      View Recipe →
                    </a>
                  <p className="text-sm text-gray-700 line-clamp-4" dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites
