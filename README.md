# Course Study Planner (Web Application)
**Project for CIT22103 Cloud Computing Final Project**

Live Web Application: [https://duhg3c1fs7p9q.cloudfront.net](https://duhg3c1fs7p9q.cloudfront.net)

## 🌟 Overview
This is a cloud-native web application designed to help students manage their courses, assignments, and study materials. The application is built using a serverless architecture to ensure high performance, security, and scalability.

## 🚀 Features
- **User Authentication:** Secure login and registration via AWS Cognito.
- **Course Management:** Create, view, update, and delete academic courses.
- **Assignment Tracking:** Manage tasks and deadlines for each course.
- **File Upload:** Upload and store syllabus or study materials securely in S3.
- **Global Catalog:** A public view of courses shared by users, cached via CDN.

## 🏗 Architecture
The system is built entirely on **Amazon Web Services (AWS)** using:
- **Frontend:** React (Hosted on S3 + CloudFront CDN).
- **API Layer:** API Gateway (REST API).
- **Backend:** AWS Lambda (Node.js).
- **Database:** Amazon DynamoDB (NoSQL).
- **Auth:** AWS Cognito.

## 📂 Project Structure
- `/frontend`: The source code for the React web page.
- `/backend`: Lambda functions for data handling.
- `/infrastructure`: AWS SAM template for the cloud resources.

## 🛠 Setup & Local Development
If you want to run the project locally:
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---
**Prepared for:** CIT22103 Cloud Computing Final Project
