import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function Dashboard({ user }) {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalCourses: 0, totalAssignments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const result = await apiService.getCourses();
            const courses = result.courses || [];
            setCourses(courses);

            // Calculate total assignments across all courses
            let totalAssignments = 0;
            for (const course of courses) {
                try {
                    const assignmentsRes = await apiService.getAssignments(course.courseId);
                    totalAssignments += (assignmentsRes.assignments || []).length;
                } catch (error) {
                    console.error(`Failed to load assignments for course ${course.courseId}:`, error);
                }
            }

            setStats({
                totalCourses: result.count || 0,
                totalAssignments: totalAssignments
            });
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="spinner" style={{ margin: '60px auto' }}></div>;
    }

    return (
        <div className="dashboard container">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">Welcome back! Here's your study overview.</p>
            </div>

            <div className="grid grid-2 mb-4">
                <div className="card">
                    <div className="card-body text-center">
                        <h3 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.totalCourses}</h3>
                        <p>Total Courses</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body text-center">
                        <h3 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.totalAssignments}</h3>
                        <p>Assignments</p>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex-between mb-3">
                    <h2>Recent Courses</h2>
                    <a href="/courses" className="btn btn-primary">View All Courses</a>
                </div>

                {courses.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📚</div>
                        <h3 className="empty-state-title">No courses yet</h3>
                        <p className="empty-state-text">Start by creating your first course</p>
                        <a href="/courses" className="btn btn-primary">Create Course</a>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {courses.slice(0, 6).map(course => (
                            <div key={course.courseId} className="card">
                                <div className="card-header">
                                    <h3>{course.title}</h3>
                                    <span className="badge badge-info">{course.semester}</span>
                                </div>
                                <div className="card-body">
                                    <p>{course.description || 'No description'}</p>
                                    {course.instructor && <p className="text-muted">👨‍🏫 {course.instructor}</p>}
                                    {course.credits && <p className="text-muted">📊 {course.credits} credits</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
