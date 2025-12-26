import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function CourseModal({ course, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        semester: '',
        credits: 0,
        isPublic: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title || '',
                description: course.description || '',
                instructor: course.instructor || '',
                semester: course.semester || '',
                credits: course.credits || 0,
                isPublic: course.isPublic === 'true'
            });
        }
    }, [course]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (course) {
                await apiService.updateCourse(course.courseId, formData);
            } else {
                await apiService.createCourse(formData);
            }
            onSave();
        } catch (error) {
            console.error('Failed to save course:', error);
            alert('Failed to save course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{course ? 'Edit Course' : 'Create New Course'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Course Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="e.g., Introduction to Computer Science"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the course"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Instructor</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.instructor}
                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                            placeholder="e.g., Dr. Smith"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Semester *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            required
                            placeholder="e.g., Fall 2024"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Credits</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                            min="0"
                            max="10"
                        />
                    </div>

                    <div className="form-group">
                        <label className="flex gap-1" style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={formData.isPublic}
                                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            />
                            <span>Make this course public (visible in catalog)</span>
                        </label>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Saving...' : 'Save Course'}
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CourseModal;
