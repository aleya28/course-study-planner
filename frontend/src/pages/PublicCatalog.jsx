import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function PublicCatalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPublicCourses();
    }, []);

    const loadPublicCourses = async () => {
        try {
            const result = await apiService.getPublicCatalog();
            setCourses(result.courses || []);
        } catch (error) {
            console.error('Failed to load public catalog:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="spinner" style={{ margin: '60px auto' }}></div>;
    }

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
            <div className="page-header">
                <h1 className="page-title">📖 Public Course Catalog</h1>
                <p className="page-description">
                    Browse publicly available courses shared by the community
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3 className="empty-state-title">No public courses available</h3>
                    <p className="empty-state-text">
                        Check back later for public courses shared by other users
                    </p>
                </div>
            ) : (
                <div className="grid grid-3">
                    {courses.map(course => (
                        <div key={course.courseId} className="card">
                            <div className="card-header">
                                <h3>{course.title}</h3>
                                <span className="badge badge-success">Public</span>
                            </div>
                            <div className="card-body">
                                <p>{course.description || 'No description'}</p>
                                {course.instructor && (
                                    <p className="text-muted">👨‍🏫 {course.instructor}</p>
                                )}
                                <div className="flex gap-1 mt-2">
                                    {course.semester && (
                                        <span className="badge badge-info">{course.semester}</span>
                                    )}
                                    {course.credits > 0 && (
                                        <span className="badge badge-info">{course.credits} credits</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PublicCatalog;
