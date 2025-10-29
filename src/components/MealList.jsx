// src/components/MealList.jsx
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import MealCard from "./MealCard";

export default function MealList() {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "meals"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setMeals(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => {
            console.error("MealList snapshot error:", err);
        });
        return unsub;
    }, []);

    if (!meals.length) return <p className="p-4 text-center text-gray-600">No meals yet.</p>;

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
            {meals.map(m => <MealCard key={m.id} meal={m} />)}
        </div>
    );
}
