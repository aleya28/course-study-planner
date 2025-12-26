import { awsConfig } from '../aws-config';
import { authService } from './authService';

const API_BASE = awsConfig.apiEndpoint;

class ApiService {
    async getHeaders() {
        const token = await authService.getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }
        return response.json();
    }

    // Courses
    async getCourses() {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses`, { method: 'GET', headers });
        return this.handleResponse(response);
    }

    async getCourse(courseId) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses/${courseId}`, { method: 'GET', headers });
        return this.handleResponse(response);
    }

    async createCourse(courseData) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses`, {
            method: 'POST',
            headers,
            body: JSON.stringify(courseData)
        });
        return this.handleResponse(response);
    }

    async updateCourse(courseId, courseData) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses/${courseId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(courseData)
        });
        return this.handleResponse(response);
    }

    async deleteCourse(courseId) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses/${courseId}`, { method: 'DELETE', headers });
        return this.handleResponse(response);
    }

    // Assignments
    async getAssignments(courseId) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses/${courseId}/assignments`, { method: 'GET', headers });
        return this.handleResponse(response);
    }

    async createAssignment(courseId, assignmentData) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses/${courseId}/assignments`, {
            method: 'POST',
            headers,
            body: JSON.stringify(assignmentData)
        });
        return this.handleResponse(response);
    }

    async updateAssignment(assignmentId, assignmentData) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/assignments/${assignmentId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(assignmentData)
        });
        return this.handleResponse(response);
    }

    async deleteAssignment(assignmentId, courseId) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/assignments/${assignmentId}`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ courseId })
        });
        return this.handleResponse(response);
    }

    // Files
    async uploadFile(courseId, fileName, fileType, fileSize) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses/${courseId}/files/upload`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ fileName, fileType, fileSize })
        });
        return this.handleResponse(response);
    }

    async getFiles(courseId) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/courses/${courseId}/files`, { method: 'GET', headers });
        return this.handleResponse(response);
    }

    async getFileUrl(fileId) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_BASE}/files/${fileId}`, { method: 'GET', headers });
        return this.handleResponse(response);
    }

    // Public
    async getPublicCatalog() {
        const response = await fetch(`${API_BASE}/public/catalog`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return this.handleResponse(response);
    }
}

export default new ApiService();
