import React, { useEffect, useState } from 'react';
import './StudentDashboard.css';
import { FaUserCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import ChatBot from '../ChatBot/ChatBot.jsx'; // Import the ChatBot component

function StudentDashboard({ handleLogout }) {
  const [syllabiList, setSyllabiList] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [filter, setFilter] = useState("");
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currentSyllabusId, setCurrentSyllabusId] = useState(null); // Track the current syllabus ID

  // Fetch syllabi
  const fetchSyllabi = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_syllabus'); // Ensure this URL is correct
      const data = await response.json();
      if (response.ok) {
        const formattedSyllabi = data.map(syllabus => ({
          ...syllabus,
          _id: syllabus._id.toString(),
        }));
        setSyllabiList(formattedSyllabi);
      }
    } catch (error) {
      console.error("An error occurred while fetching syllabi:", error);
    }
  };

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const handleViewSyllabus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/view_syllabus/pdf/${id}`); // Corrected endpoint for viewing PDF
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setShowPdfViewer(true);
      }
    } catch (error) {
      console.error("An error occurred while fetching the syllabus PDF:", error);
    }
  };

  const handleClosePdfViewer = () => {
    setPdfUrl("");
    setShowPdfViewer(false);
  };

  const handleChat = (syllabusId) => {
    console.log(`Chat button clicked for syllabus ID: ${syllabusId}`);
    setCurrentSyllabusId(syllabusId); // Set the current syllabus ID
    setShowChatBot(true); // Show the ChatBot when the chat button is clicked
  };

  const handleCloseChatBot = () => {
    setShowChatBot(false);
  };

  const handleMessageSend = async () => {
    if (userInput.trim() !== "") {
      const newMessage = { sender: "user", text: userInput };
      setChatMessages([...chatMessages, newMessage]);
      setUserInput("");
      
      try {
        // Send the question to the backend with the updated endpoint
        const response = await fetch(`http://localhost:5000/chat_with_pdf`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            syllabus_id: currentSyllabusId,  // Pass the syllabus ID
            question: userInput,             // Pass the user question
          }),
        });

        const data = await response.json();
        const botResponse = { sender: "bot", text: data.answer || "Sorry, I couldn't find an answer." };
        // setChatMessages(prevMessages => [...prevMessages, newMessage, botResponse]);
      } catch (error) {
        console.error("An error occurred while sending the question:", error);
        const botResponse = { sender: "bot", text: "An error occurred. Please try again." };
        // setChatMessages(prevMessages => [...prevMessages, newMessage, botResponse]);
      }

    }
  };

  const filteredSyllabi = syllabiList.filter(syllabus =>
    syllabus.syllabus_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="student-dashboard">
      <header className="head">
        <div className="user-info">
          <FaUserCircle size={30} />
          <span className="username">{localStorage.getItem('username')}</span>
          <FaSignOutAlt className="logout-icon" size={30} onClick={handleLogout} />
        </div>
      </header>

      <div>
        <h2>Syllabus</h2>
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="syllabi-grid">
          {filteredSyllabi.map(syllabus => (
            <div key={syllabus._id} className="syllabus-card">
              <h3>{syllabus.syllabus_name}</h3>
              <p>Course ID: {syllabus.course_id}</p>
              <p>Course Name: {syllabus.course_name}</p>
              <p>Department ID: {syllabus.department_id}</p>
              <p>Department Name: {syllabus.department_name}</p>
              <p>Created By: {syllabus.created_by}</p>
              <button className="view-button" onClick={() => handleViewSyllabus(syllabus._id)}>View PDF</button>
              <button className="chat-button" onClick={() => handleChat(syllabus._id)}>Chat</button>
            </div>
          ))}
        </div>
      </div>

      {showPdfViewer && (
        <div className="pdf-viewer">
          <div className="pdf-viewer-content">
            <button className="close-button" onClick={handleClosePdfViewer}>
              <FaTimes />
            </button>
            <iframe src={pdfUrl} title="Syllabus PDF"></iframe>
          </div>
        </div>
      )}

      {showChatBot && (
        <ChatBot
          chatMessages={chatMessages}
          handleMessageSend={handleMessageSend}
          userInput={userInput}
          setUserInput={setUserInput}
          closeChatBot={handleCloseChatBot}
        />
      )}
    </div>
  );
}

export default StudentDashboard;
