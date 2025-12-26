import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import CourseModal from '../components/CourseModal';
import CourseDetailModal from '../components/CourseDetailModal';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const result = await apiService.getCourses();
            setCourses(result.courses || []);
        } catch (error) {
            console.error('Failed to load courses:', error);
            alert('Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = () => {
        setSelectedCourse(null);
        setShowModal(true);
    };

    const handleEditCourse = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const handleViewCourse = (course) => {
        setSelectedCourse(course);
        setShowDetailModal(true);
    };

    const handleDeleteCourse = async (courseId) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        try {
            await apiService.deleteCourse(courseId);
            await loadCourses();
        } catch (error) {
            console.error('Failed to delete course:', error);
            alert('Failed to delete course. Please try again.');
        }
    };

    const handleSaveCourse = async () => {
        setShowModal(false);
        setShowDetailModal(false);
        await loadCourses();
    };

    if (loading) {
        return <div className="spinner" style={{ margin: '60px auto' }}></div>;
    }

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
            <div className="page-header">
                <div className="flex-between">
                    <div>
                        <h1 className="page-title">My Courses</h1>
                        <p className="page-description">Manage all your courses in one place</p>
                    </div>
                    <button onClick={handleCreateCourse} className="btn btn-primary">
                        ➕ Add Course
                    </button>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h3 className="empty-state-title">No courses yet</h3>
                    <p className="empty-state-text">Create your first course to get started</p>
                    <button onClick={handleCreateCourse} className="btn btn-primary">
                        Create Your First Course
                    </button>
                </div>
            ) : (
                <div className="grid grid-3">
                    {courses.map(course => (
                        <div key={course.courseId} className="card">
                            <div className="card-header">
                                <h3>{course.title}</h3>
                                <div className="flex gap-1 mt-2">
                                    <span className="badge badge-info">{course.semester}</span>
                                    {course.isPublic === 'true' && (
                                        <span className="badge badge-success">Public</span>
                                    )}
                                </div>
                            </div>
                            <div className="card-body">
                                <p>{course.description || 'No description'}</p>
                                {course.instructor && (
                                    <p className="text-muted">👨‍🏫 {course.instructor}</p>
                                )}
                                {course.credits > 0 && (
                                    <p className="text-muted">📊 {course.credits} credits</p>
                                )}
                            </div>
                            <div className="card-footer">
                                <button
                                    onClick={() => handleViewCourse(course)}
                                    className="btn btn-sm btn-primary"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleEditCourse(course)}
                                    className="btn btn-sm btn-secondary"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCourse(course.courseId)}
                                    className="btn btn-sm btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <CourseModal
                    course={selectedCourse}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveCourse}
                />
            )}

            {showDetailModal && (
                <CourseDetailModal
                    course={selectedCourse}
                    onClose={() => setShowDetailModal(false)}
                    onRefresh={handleSaveCourse}
                />
            )}
        </div>
    );
}

export default Courses;
