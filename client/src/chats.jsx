/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";
import "./chats.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Messages:", messagesArray); // Debugging
      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, []);
  
  const checkProfanity = async (text) => {
    try {
      const response = await fetch("http://localhost:5000/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Profanity check result:", result);
      return result.isOffensive;
    } catch (error) {
      console.error("Error checking profanity:", error);
      return false; // Assume non-offensive if an error occurs
    }
  };
  

  // Send a message with profanity check
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const isProfane = await checkProfanity(newMessage);
      console.log("Is Profane:", isProfane); // Debugging

      if (isProfane) {
        alert("Message contains inappropriate content and cannot be sent. Please be respectful.");
        setNewMessage(""); // Clear input
        await logProfanity(newMessage); // Optionally log flagged messages
        return;
      }

      await addDoc(collection(db, "messages"), {
        text: newMessage,
        timestamp: new Date(),
        user: auth.currentUser?.email || "Anonymous",
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error in sendMessage:", error);
    }
  };

  // Log flagged profanity messages
  const logProfanity = async (message) => {
    try {
      console.log("Logging flagged message:", message); // Debugging
      await addDoc(collection(db, "flagged_messages"), {
        text: message,
        timestamp: new Date(),
        user: auth.currentUser?.email || "Anonymous",
      });
    } catch (error) {
      console.error("Error logging flagged message:", error);
    }
  };

  // Check if the user is logged in
  const isUserLoggedIn = auth.currentUser;

  return (
    <div className="chat-container">
      {!isUserLoggedIn ? (
        <div className="please-sign-in">
          <h2>Please sign in to chat</h2>
        </div>
      ) : (
        <>
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <strong>{message.user}:</strong> {message.text}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
