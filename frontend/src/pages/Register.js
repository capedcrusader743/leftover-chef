import React, { useEffect, useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, registerWithEmailAndPassword } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

function Register() {
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
      <h2 className="text-xl font-semibold mb-4">Register</h2>
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
        onClick={() => registerWithEmailAndPassword(email, password)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </div>
  );
}

export default Register;
