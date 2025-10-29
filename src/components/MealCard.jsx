// src/components/MealCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function MealCard({ meal }) {
    return (
        <div className="border rounded p-3 flex flex-col bg-white shadow-sm">
            <div className="h-40 bg-gray-100 rounded mb-2 overflow-hidden flex items-center justify-center">
                {meal.imageUrl ? (
                    <img src={meal.imageUrl} alt={meal.title} className="object-cover h-full w-full" />
                ) : (
                    <span className="text-sm text-gray-500">No image</span>
                )}
            </div>

            <h3 className="font-semibold text-lg">{meal.title}</h3>
            <p className="text-sm text-gray-600 flex-1 my-2">{meal.description}</p>

            <div className="mt-2 flex items-center justify-between">
                <div className="text-lg font-medium">₹{meal.price}</div>
                <div>
                    {meal.contact?.phone ? (
                        <a href={`tel:${meal.contact.phone}`} className="text-sm underline">Call</a>
                    ) : meal.contact?.email ? (
                        <a href={`mailto:${meal.contact.email}`} className="text-sm underline">Email</a>
                    ) : meal.contact?.area ? (
                        <Link to={`/meal/${meal.id}`} className="text-sm underline">View</Link>
                    ) : null}
                </div>

                <div className="text-xs text-gray-500 mt-2">Location: {meal.location}</div>
            </div>
        </div>
    );
}
