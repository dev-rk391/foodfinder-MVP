// src/components/MealDetails.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, runTransaction } from "firebase/firestore";
import { db } from "../firebase/config";
import { useParams } from "react-router-dom";

export default function MealDetails() {
    const { id } = useParams();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        let mounted = true;
        const load = async () => {
            const docRef = doc(db, "meals", id);
            const snap = await getDoc(docRef);
            if (snap.exists() && mounted) {
                setMeal({ id: snap.id, ...snap.data() });
            }
            // increment views safely using transaction
            try {
                await runTransaction(db, async (tx) => {
                    const m = await tx.get(docRef);
                    if (!m.exists()) return;
                    const newViews = (m.data().views || 0) + 1;
                    tx.update(docRef, { views: newViews });
                });
            } catch (e) {
                console.error("Transaction failed:", e);
            }
            setLoading(false);
        };
        load();
        return () => { mounted = false; };
    }, [id]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (!meal) return <p className="p-4">Meal not found.</p>;

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
            {meal.imageUrl && <img src={meal.imageUrl} alt={meal.title} className="w-full h-64 object-cover rounded mb-4" />}
            <h2 className="text-2xl font-bold">{meal.title}</h2>
            <p className="text-gray-700 my-2">{meal.description}</p>
            <div className="flex justify-between items-center mt-3">
                <div className="text-lg font-semibold">₹{meal.price}</div>
                <div className="text-sm text-gray-500">Views: {meal.views ?? 0}</div>
            </div>
            <div className="mt-4">
                {meal.contact?.phone ? <a href={`tel:${meal.contact.phone}`} className="underline">Call</a> : null}
                {meal.contact?.email ? <a className="ml-4 underline" href={`mailto:${meal.contact.email}`}>Email</a> : null}
            </div>
        </div>
    );
}
