/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { db } from "../src/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedLogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(fetchedLogs);
    };

    fetchLogs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Deletion Logs</h1>

      <div className="grid grid-cols-1 gap-4">
        {logs.map((log) => (
          <div key={log.id} className="p-4 bg-white shadow-md rounded-md border border-gray-300">
            <h3 className="text-xl font-bold mb-2">Request: {log.title}</h3>
            <p className="text-gray-700"><strong>Action:</strong> {log.action}</p>
            <p className="text-gray-700"><strong>Deleted By:</strong> {log.deletedBy}</p>
            <p className="text-gray-700"><strong>Timestamp:</strong> {new Date(log.timestamp.seconds * 1000).toString()}</p>
            {log.reason && <p className="text-gray-700"><strong>Reason:</strong> {log.reason}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logs;