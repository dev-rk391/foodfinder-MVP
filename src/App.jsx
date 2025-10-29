// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import SignIn from "./components/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import AddMealForm from "./components/AddMealForm";
import MealList from "./components/MealList";
import MealDetails from "./components/MealDetails";

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">FoodFinder</h1>
      <MealList />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <nav className="p-3 border-b flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/add">Add Meal</Link>
        <Link to="/signin">Sign In</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddMealForm />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/meal/:id" element={<MealDetails />} />
      </Routes>
    </AuthProvider>
  );
}

// export default function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <h1 className="text-6xl font-bold text-indigo-600">Tailwind Works</h1>
//     </div>
//   );
// }
