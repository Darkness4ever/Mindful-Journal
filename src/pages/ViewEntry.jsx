// src/pages/ViewEntry.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ViewEntry = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const ref = doc(db, "entries", id);
        const snap = await getDoc(ref);

        if (!snap.exists() || snap.data().userId !== currentUser.uid) {
          navigate("/");
          return;
        }
        setEntry({ id: snap.id, ...snap.data() });
      } catch {
        navigate("/");
      }
    };
    fetchEntry();
  }, [id, currentUser, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteDoc(doc(db, "entries", id));
      navigate("/");
    } catch {
      setError("Delete failed. Please try again.");
    }
  };

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          {entry.title}
        </h1>

        <div className="prose prose-gray mb-6">
          {/* prose classes require @tailwindcss/typography */}
          <p>{entry.content}</p>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Created: {entry.createdAt?.toDate().toLocaleString()}
        </p>
        {entry.updatedAt && (
          <p className="text-sm text-gray-500 mb-6">
            Last Updated: {entry.updatedAt?.toDate().toLocaleString()}
          </p>
        )}

        <div className="flex space-x-4">
          <Link
            to={`/edit/${id}`}
            className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEntry;
