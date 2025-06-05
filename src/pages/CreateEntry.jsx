// src/pages/CreateEntry.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CreateEntry = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      return setError("Both title and content are required.");
    }

    try {
      const entriesRef = collection(db, "entries");
      await addDoc(entriesRef, {
        title,
        content,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate("/");
    } catch {
      setError("Failed to save. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">New Entry</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="Entry title..."
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y"
              placeholder="Write your thoughts..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-primary-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEntry;
