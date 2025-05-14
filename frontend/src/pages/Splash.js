import React from 'react';
import { useNavigate } from 'react-router-dom';

function Splash() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white px-4">
      <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Leftover Chef</h1>
      <p className="text-xl mb-8 text-slate-300">Ready to Get Cookin?</p>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
          onClick={() => handleNavigation('/register')}
        >
          Sign Up Now
        </button>

        <p className="text-center text-sm text-slate-400">Already have an account?</p>

        <button
          className="bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 rounded-xl shadow-sm transition-all duration-300"
          onClick={() => handleNavigation('/login')}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Splash;
