import React, { useEffect, useState } from 'react';
import './ProfessorDashboard.css';
import { FaUserCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';

function ProfessorDashboard({ handleLogout }) {
    const [syllabiList, setSyllabiList] = useState([]);
    const [pdfUrl, setPdfUrl] = useState("");
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [newSyllabus, setNewSyllabus] = useState({
        course_id: "",
        course_name: "",
        department_id: "",
        department_name: "",
        syllabus_name: "",
        created_by: "",
        file: null,
    });
    const [activeTab, setActiveTab] = useState('add');
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
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
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setNewSyllabus(prevState => ({
                ...prevState,
                created_by: storedUsername
            }));
        }
        fetchSyllabi();
    }, []);

    const handleNewSyllabusSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in newSyllabus) {
            formData.append(key, newSyllabus[key]);
        }
        try {
            const response = await fetch('http://localhost:5000/add_syllabus', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error("An error occurred while adding the syllabus:", error);
        }
    };

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

    const handleDeleteSyllabus = async () => {
        const id = confirmDelete.id;
        try {
            const response = await fetch(`http://localhost:5000/delete_syllabus/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchSyllabi();
                setConfirmDelete({ open: false, id: null });
            }
        } catch (error) {
            console.error("An error occurred while deleting the syllabus:", error);
        }
    };

    const filteredSyllabi = syllabiList.filter(syllabus => 
        syllabus.syllabus_name.toLowerCase().includes(filter.toLowerCase()) ||
        syllabus.course_id.toLowerCase().includes(filter.toLowerCase()) ||
        syllabus.department_name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="professor-dashboard">
            <header className="header">
                <nav className="navigation-menu">
                    <button 
                        className={activeTab === 'add' ? 'active' : ''} 
                        onClick={() => setActiveTab('add')}
                    >
                        Add Syllabus
                    </button>
                    <button 
                        className={activeTab === 'uploaded' ? 'active' : ''} 
                        onClick={() => setActiveTab('uploaded')}
                    >
                        Uploaded Syllabus
                    </button>
                </nav>
                <div className="user-info">
                    <FaUserCircle size={30} />
                    <span className="username">{newSyllabus.created_by}</span>
                    <FaSignOutAlt 
                        className="logout-icon" 
                        size={30} 
                        onClick={handleLogout} 
                    />
                </div>
            </header>

            {activeTab === 'add' && (
                <div className="form-container">
                    <h3>Add New Syllabus</h3>
                    <form onSubmit={handleNewSyllabusSubmit}>
                        <input 
                            type="text" 
                            placeholder="Course ID" 
                            required 
                            value={newSyllabus.course_id} 
                            onChange={(e) => setNewSyllabus({ ...newSyllabus, course_id: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Course Name" 
                            required 
                            value={newSyllabus.course_name} 
                            onChange={(e) => setNewSyllabus({ ...newSyllabus, course_name: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Department ID" 
                            required 
                            value={newSyllabus.department_id} 
                            onChange={(e) => setNewSyllabus({ ...newSyllabus, department_id: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Department Name" 
                            required 
                            value={newSyllabus.department_name} 
                            onChange={(e) => setNewSyllabus({ ...newSyllabus, department_name: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Syllabus Name" 
                            required 
                            value={newSyllabus.syllabus_name} 
                            onChange={(e) => setNewSyllabus({ ...newSyllabus, syllabus_name: e.target.value })} 
                        />
                        <input 
                            type="file" 
                            accept=".pdf" 
                            required 
                            onChange={(e) => setNewSyllabus({ ...newSyllabus, file: e.target.files[0] })} 
                        />
                        <button type="submit">Add Syllabus</button>
                    </form>
                </div>
            )}

            {activeTab === 'uploaded' && (
                <div>
                    <h3>Uploaded Syllabus</h3>
                    <input 
                        type="text" 
                        placeholder="Search Syllabus" 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)} 
                    />
                    <div className="syllabi-grid">
                        {filteredSyllabi.map(syllabus => (
                            <div key={syllabus._id} className="syllabus-card">
                                <h4>{syllabus.syllabus_name}</h4>
                                <p>Course ID: {syllabus.course_id}</p>
                                <p>Department: {syllabus.department_name}</p>
                                <button className="view-button" onClick={() => handleViewSyllabus(syllabus._id)}>View</button>
                                <button className="delete-button" onClick={() => setConfirmDelete({ open: true, id: syllabus._id })}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showPdfViewer && (
                <div className="pdf-viewer">
                    <div className="pdf-viewer-content">
                        <button className="close-button" onClick={handleClosePdfViewer}><FaTimes /></button>
                        <iframe src={pdfUrl} title="Syllabus PDF"></iframe>
                    </div>
                </div>
            )}

            {confirmDelete.open && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <h3>Are you sure you want to delete this syllabus?</h3>
                        <button onClick={handleDeleteSyllabus}>Yes</button>
                        <button onClick={() => setConfirmDelete({ open: false, id: null })}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfessorDashboard;
