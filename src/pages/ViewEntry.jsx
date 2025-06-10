// src/pages/ViewEntry.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const ViewEntry = () => {
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const entryRef = doc(db, "entries", id);
        const entrySnap = await getDoc(entryRef);

        if (entrySnap.exists()) {
          const data = entrySnap.data();
          // Ensure the entry belongs to the current user
          if (data.userId !== currentUser.uid) {
            setError("You don't have permission to view this entry");
            return;
          }
          setEntry({ id: entrySnap.id, ...data });
        } else {
          setError("Entry not found");
        }
      } catch (err) {
        setError("Error fetching entry");
        console.error(err);
      }
    };

    fetchEntry();
  }, [id, currentUser]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const entryRef = doc(db, "entries", id);
        await deleteDoc(entryRef);
        navigate("/");
      } catch (err) {
        setError("Error deleting entry");
        console.error(err);
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-xl shadow-sm animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-4 break-words">
            {entry.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <time dateTime={entry.createdAt?.toDate().toISOString()}>
              Created:{" "}
              {entry.createdAt?.toDate().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
            {entry.updatedAt && (
              <time dateTime={entry.updatedAt?.toDate().toISOString()}>
                · Updated:{" "}
                {entry.updatedAt?.toDate().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            )}
          </div>
        </div>

        <div className="prose prose-primary prose-lg max-w-none mb-8">
          <p className="whitespace-pre-wrap break-words">{entry.content}</p>
        </div>

        <div className="flex items-center space-x-4 border-t border-primary-100 pt-6">
          <Link
            to={`/edit/${id}`}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Delete
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEntry;
