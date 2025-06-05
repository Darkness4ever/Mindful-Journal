// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);

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
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Your Entries</h1>
        <Link
          to="/create"
          className="bg-accent-500 text-white font-medium px-5 py-2 rounded-lg hover:bg-accent-600 transition"
        >
          + New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center text-gray-600 py-20">
          <p className="text-xl">No entries yet.</p>
          <p className="mt-2">Click “New Entry” to add your first journal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/entry/${entry.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {entry.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {entry.content}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {entry.createdAt?.toDate().toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
