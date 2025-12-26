import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function CourseDetailModal({ course, onClose, onRefresh }) {
    const [assignments, setAssignments] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', status: 'pending' });
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);

    useEffect(() => {
        loadCourseDetails();
    }, [course]);

    const loadCourseDetails = async () => {
        try {
            const [assignmentsRes, filesRes] = await Promise.all([
                apiService.getAssignments(course.courseId),
                apiService.getFiles(course.courseId)
            ]);
            setAssignments(assignmentsRes.assignments || []);
            setFiles(filesRes.files || []);
        } catch (error) {
            console.error('Failed to load course details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        try {
            await apiService.createAssignment(course.courseId, newAssignment);
            setNewAssignment({ title: '', description: '', dueDate: '', status: 'pending' });
            setShowAssignmentForm(false);
            await loadCourseDetails();
        } catch (error) {
            console.error('Failed to create assignment:', error);
            alert('Failed to create assignment');
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!confirm('Delete this assignment?')) return;
        try {
            await apiService.deleteAssignment(assignmentId, course.courseId);
            await loadCourseDetails();
        } catch (error) {
            console.error('Failed to delete assignment:', error);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const uploadData = await apiService.uploadFile(course.courseId, file.name, file.type, file.size);

            await fetch(uploadData.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            alert('File uploaded successfully!');
            await loadCourseDetails();
        } catch (error) {
            console.error('Failed to upload file:', error);
            alert('Failed to upload file');
        }
    };

    const handleFileClick = async (fileId) => {
        try {
            const urlData = await apiService.getFileUrl(fileId);
            if (urlData.downloadUrl) {
                // Open file in new tab
                window.open(urlData.downloadUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to get file URL:', error);
            alert('Failed to open file');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <h2>{course.title}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        <div className="mb-4">
                            <p>{course.description}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="badge badge-info">{course.semester}</span>
                                {course.instructor && <span className="badge badge-info">👨‍🏫 {course.instructor}</span>}
                                {course.credits > 0 && <span className="badge badge-info">📊 {course.credits} credits</span>}
                            </div>
                        </div>

                        <hr style={{ border: '1px solid var(--border)', margin: '20px 0' }} />

                        <div className="mb-4">
                            <div className="flex-between mb-2">
                                <h3>Assignments ({assignments.length})</h3>
                                <button
                                    onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                                    className="btn btn-sm btn-primary"
                                >
                                    {showAssignmentForm ? 'Cancel' : '+ Add Assignment'}
                                </button>
                            </div>

                            {showAssignmentForm && (
                                <form onSubmit={handleAddAssignment} className="card mb-3">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Assignment title"
                                            value={newAssignment.title}
                                            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={newAssignment.dueDate}
                                            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-sm btn-primary">Save Assignment</button>
                                </form>
                            )}

                            {assignments.length === 0 ? (
                                <p className="text-muted">No assignments yet</p>
                            ) : (
                                <div className="grid gap-2">
                                    {assignments.map(assignment => (
                                        <div key={assignment.assignmentId} className="card">
                                            <div className="flex-between">
                                                <div>
                                                    <h4 style={{ margin: 0 }}>{assignment.title}</h4>
                                                    <p className="text-muted">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <span className={`badge ${assignment.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                                        {assignment.status}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteAssignment(assignment.assignmentId)}
                                                        className="btn btn-sm btn-danger"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr style={{ border: '1px solid var(--border)', margin: '20px 0' }} />

                        <div>
                            <div className="flex-between mb-2">
                                <h3>Course Materials ({files.length})</h3>
                                <label className="btn btn-sm btn-primary" style={{ cursor: 'pointer' }}>
                                    📎 Upload File
                                    <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                                </label>
                            </div>

                            {files.length === 0 ? (
                                <p className="text-muted">No files uploaded yet</p>
                            ) : (
                                <div className="grid gap-2">
                                    {files.map(file => (
                                        <div
                                            key={file.fileId}
                                            className="card"
                                            onClick={() => handleFileClick(file.fileId)}
                                            style={{
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(124, 58, 237, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div className="flex-between">
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '500' }}>📄 {file.fileName}</p>
                                                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                        {(file.fileSize / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFileClick(file.fileId);
                                                    }}
                                                    style={{ flexShrink: 0 }}
                                                >
                                                    📥 Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CourseDetailModal;
