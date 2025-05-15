import React, { useEffect, useState } from "react";
import { auth, logInWithEmailAndPassword, signInWithGoogle, sendPasswordReset } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/home");
  }, [user, loading]);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input
        type="email"
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={() => logInWithEmailAndPassword(email, password)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
      <button
        onClick={signInWithGoogle}
        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
      >
        Login with Google
      </button>
      <p className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer text-center" onClick={() => sendPasswordReset(email)}>
        Forgot Password?
      </p>
    </div>
  );
}

export default Login;
