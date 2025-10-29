// src/components/SignIn.jsx
import React, { useState } from "react";
import { auth, googleProvider } from "../firebase/config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            if (isRegister) {
                await createUserWithEmailAndPassword(auth, email, pass);
            } else {
                await signInWithEmailAndPassword(auth, email, pass);
            }
            navigate("/");
        } catch (error) {
            setErr(error.message);
        }
    };

    const signInGoogle = async () => {
        setErr("");
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/");
        } catch (error) {
            setErr(error.message);
        }
    };

    const resetPassword = async () => {
        if (!email) return setErr("Enter your email to reset password");
        try {
            await sendPasswordResetEmail(auth, email);
            setErr("Password reset email sent (check inbox).");
        } catch (error) {
            setErr(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 mt-8">
            <h2 className="text-2xl font-semibold mb-4">{isRegister ? "Register" : "Sign in"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full p-2 rounded bg-blue-600 text-white">
                    {isRegister ? "Create account" : "Sign in"}
                </button>
            </form>

            <button onClick={signInGoogle} className="mt-3 w-full p-2 border rounded">
                Sign in with Google
            </button>

            <div className="mt-3 flex justify-between items-center">
                <button onClick={() => setIsRegister((v) => !v)} className="text-sm underline">
                    {isRegister ? "Already have an account? Sign in" : "Create an account"}
                </button>
                <button onClick={resetPassword} className="text-sm underline">
                    Forgot password?
                </button>
            </div>

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        </div>
    );
}
