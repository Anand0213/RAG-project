import React, { useEffect, useState } from 'react';
import './StudentDashboard.css';
import { FaUserCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';

function StudentDashboard({ handleLogout }) {
    const [syllabiList, setSyllabiList] = useState([]);
    const [pdfUrl, setPdfUrl] = useState("");
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [filter, setFilter] = useState("");

    const fetchSyllabi = async () => {
        try {
            const response = await fetch('http://localhost:5000/get_syllabus');
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
            const response = await fetch(`http://localhost:5000/view_syllabus/pdf/${id}`);
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

    const filteredSyllabi = syllabiList.filter(syllabus => 
        syllabus.syllabus_name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleChat = (syllabusId) => {
        // Implement chat functionality here
        console.log(`Chat button clicked for syllabus ID: ${syllabusId}`);
    };

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
        </div>
    );
}

export default StudentDashboard;
