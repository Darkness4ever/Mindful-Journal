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

    // 1. Reference the 'entries' collection
    const entriesRef = collection(db, "entries");

    // 2. Build a query: where userId == currentUser.uid, order by createdAt desc
    const q = query(
      entriesRef,
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    // 3. Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setEntries(items);
    });

    // 4. Clean up subscription on unmount
    return unsubscribe;
  }, [currentUser]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Your Entries</h1>
        <Link
          to="/create"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          + New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-600">
          No entries yet. Click “New Entry” to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/entry/${entry.id}`}
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {entry.title}
              </h2>
              <p className="text-gray-600 line-clamp-2">{entry.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                {entry.createdAt?.toDate().toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
