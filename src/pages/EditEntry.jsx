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
    <div className="flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Edit Entry
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700">Content</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEntry;
