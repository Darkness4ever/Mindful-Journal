// src/pages/EditEntry.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const EditEntry = () => {
  const { id } = useParams(); // Entry ID from URL
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the document data to prefill form
    const fetchEntry = async () => {
      try {
        const entryRef = doc(db, "entries", id);
        const entrySnap = await getDoc(entryRef);

        if (entrySnap.exists()) {
          const data = entrySnap.data();
          // Ensure the entry belongs to the current user
          if (data.userId !== currentUser.uid) {
            navigate("/");
            return;
          }
          setTitle(data.title);
          setContent(data.content);
        } else {
          // If no document, redirect
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };

    fetchEntry();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      return setError("Title and content cannot be empty.");
    }

    try {
      const entryRef = doc(db, "entries", id);
      await updateDoc(entryRef, {
        title,
        content,
        updatedAt: serverTimestamp(),
      });
      navigate(`/entry/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update entry. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Edit Entry
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="Entry title..."
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Content</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y"
              placeholder="Write your thoughts..."
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-primary-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Update
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

export default EditEntry;
