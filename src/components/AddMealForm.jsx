// src/components/AddMealForm.jsx
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config"; // note: storage export
import { useAuth } from "./AuthProvider";

export default function AddMealForm() {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [contact, setContact] = useState("");
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!user) return setMsg("Sign in to add meals.");

        try {
            let imageUrl = "";
            if (file) {
                // storage ref path: meals/<uid>/<timestamp>_<filename>
                const path = `meals/${user.uid}/${Date.now()}_${file.name}`;
                const storageRef = ref(storage, path);
                const uploadTask = uploadBytesResumable(storageRef, file);

                // wait for upload to complete with progress
                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            setUploadProgress(pct);
                        },
                        (err) => reject(err),
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            await addDoc(collection(db, "meals"), {
                title,
                description: desc,
                price: Number(price || 0),
                location,
                tags: [],
                imageUrl,
                contact: { phone: contact, email: user.email || "", preferred: "phone" },
                ownerId: user.uid,
                createdAt: serverTimestamp(),
                views: 0,
                available: true,
            });

            setMsg("Meal added!");
            setTitle(""); setDesc(""); setPrice(""); setLocation(""); setContact(""); setFile(null);
            setUploadProgress(0);
        } catch (e) {
            setMsg("Error: " + e.message);
        }
    };

    return (
        <form onSubmit={onSubmit} className="max-w-lg mx-auto p-4 space-y-3 bg-white rounded shadow">
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meal title" className="w-full p-2 border rounded" />
            <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
            <div className="flex gap-2">
                <input required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (₹)" className="flex-1 p-2 border rounded" />
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="flex-1 p-2 border rounded" />
            </div>
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone number" className="w-full p-2 border rounded" />
            <div>
                <label className="text-sm block mb-1">Image (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {uploadProgress > 0 && <div className="text-sm mt-1">Upload: {uploadProgress}%</div>}
            </div>

            <button type="submit" className="w-full p-2 bg-green-600 text-white rounded">Add Meal</button>
            {msg && <p className="text-sm mt-2">{msg}</p>}
        </form>
    );
}
