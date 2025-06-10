// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const entriesRef = collection(db, "entries");
    const q = query(
      entriesRef,
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setEntries(items);
    });

    return unsubscribe;
  }, [currentUser]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-gray-800 mb-2">
            Your Journal
          </h1>
          <p className="text-gray-600">Capture your thoughts and reflections</p>
        </div>
        <Link
          to="/create"
          className="bg-primary-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-primary-100">
          <svg
            className="mx-auto h-12 w-12 text-primary-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No entries yet
          </h3>
          <p className="mt-2 text-gray-600">
            Start your journaling journey today
          </p>
          <Link
            to="/create"
            className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            Create your first entry
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/entry/${entry.id}`}
              className="journal-card group bg-white rounded-xl p-6 flex flex-col justify-between border border-primary-100 hover:border-primary-200"
            >
              <div>
                <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                  {entry.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {entry.content}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {entry.createdAt?.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <span className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
