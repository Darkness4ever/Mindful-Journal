// src/pages/ViewEntry.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ViewEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const entryRef = doc(db, "entries", id);
        const entrySnap = await getDoc(entryRef);

        if (entrySnap.exists()) {
          const data = entrySnap.data();
          if (data.userId !== currentUser.uid) {
            navigate("/");
            return;
          }
          setEntry(data);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };

    fetchEntry();
  }, [id, currentUser, navigate]);

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "entries", id));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete entry.");
    }
  };

  if (!entry) {
    return <p className="text-center text-gray-600 mt-8">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {entry.title}
        </h1>
        <p className="whitespace-pre-wrap text-gray-700 mb-6">
          {entry.content}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Created: {entry.createdAt?.toDate().toLocaleString()}
        </p>
        {entry.updatedAt && (
          <p className="text-sm text-gray-500 mb-4">
            Last Updated: {entry.updatedAt?.toDate().toLocaleString()}
          </p>
        )}

        <div className="flex space-x-3">
          <Link
            to={`/edit/${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEntry;
