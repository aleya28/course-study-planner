# FINAL PROJECT REPORT: CIT22103 CLOUD COMPUTING
**Project Title:** Cloud-Native Serverless Course Study Planner  
**Live Application URL:** [https://duhg3c1fs7p9q.cloudfront.net](https://duhg3c1fs7p9q.cloudfront.net)  
**Student Name:** [Your Name]

---

## 1. Executive Summary & System Introduction
The **Course Study Planner** is a full-stack, cloud-native application developed to fulfill the final project requirements for CIT22103. The primary objective of this system is to provide a scalable, secure, and cost-efficient platform for students to manage academic data. 

By leveraging the **Serverless Architecture** on Amazon Web Services (AWS), the system eliminates the need for managing physical servers or virtual machines, adhering to the principle of **Infrastructure as Code (IaC)**. The application is hosted as a Single Page Application (SPA) delivered via a global Content Delivery Network (CDN), ensuring high availability and low latency for users worldwide.

---

## 2. Functional Requirements Implementation
The system fully implements all four core functional requirements specified in the project rubric:

### 2.1 Authenticated CRUD Operations
Users can perform full Create, Read, Update, and Delete operations on "Course" entities. Each user's data is isolated; an authenticated user can only modify their own courses. 
*   **Logic:** Managed by Node.js 20.x Lambda functions communicating with DynamoDB.

> **[PLACEHOLDER: INSERT SCREENSHOT 2.1 - Dashboard showing the list of courses]**  
> **[PLACEHOLDER: INSERT SCREENSHOT 2.2 - Form for creating/updating a course]**

### 2.2 Public Read-only Listing Page
The application includes a public catalog. By toggling a course to "Public," it becomes visible on a listing page that does not require authentication. 
*   **Performance:** This page is served through CloudFront edge caching to reduce database hits and improve load speed.

> **[PLACEHOLDER: INSERT SCREENSHOT 2.3 - Public Catalog view (no login needed)]**

### 2.3 Object Storage (Files & Documents)
The system supports the uploading of study materials (PDFs, images).
*   **Backend Flow:** The system generates a **Secure Presigned URL** from S3, allowing the browser to upload the file directly to the bucket. This prevents Lambda from hitting memory limits when handling large files.

> **[PLACEHOLDER: INSERT SCREENSHOT 2.4 - File upload process within a course]**

---

## 3. Non-Functional Requirements & Technical Stack
The application is built on a "Decoupled Serverless" design pattern:

| Category | Component | Technical Detail |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Hosted on S3 Static Website + CDN. |
| **Edge Delivery (HTTPS)** | Amazon CloudFront | Provides global caching, SSL/TLS, and origin shielding. |
| **Compute / API** | AWS Lambda & API Gateway | 13 Lambda functions providing logic; API Gateway as REST interface. |
| **Database (NoSQL)** | Amazon DynamoDB | High-performance NoSQL with Global Secondary Indexes (GSI). |
| **Storage (Object)** | Amazon S3 | Secure private storage for document uploads. |
| **Observability** | AWS CloudWatch | Centralized logging and real-time performance metrics. |

---

## 4. Architecture / Pipeline Design
The system utilizes a modern cloud pipeline that ensures state-of-the-art efficiency.

> **[PLACEHOLDER: INSERT ARCHITECTURE DIAGRAM HERE]**

### Detailed Data Flow:
1.  **Request Initiation:** The User Browser sends a request to the CloudFront URL.
2.  **CDN Handling:** CloudFront serves the React static files (HTML/JS/CSS) immediately from the nearest edge location.
3.  **API Interaction:** When a user creates a course, an HTTPS request is sent to API Gateway.
4.  **Security Check:** API Gateway forwards the JWT token to **AWS Cognito** for validation.
5.  **Logic Execution:** Upon validation, a Lambda function is triggered, performing logic and writing data to DynamoDB.
6.  **Persistence:** Data is stored in DynamoDB, and files are streamed directly to S3 via presigned URLs.

---

## 5. Security & Access Control
Security is implemented using a multi-layered approach:
*   **HTTPS Enforced:** All communication between the browser and AWS is encrypted using industry-standard TLS.
*   **JWT Authentication:** All private routes use JSON Web Tokens provided by Cognito.
*   **IAM Least Privilege:** Every Lambda function has its own IAM Execution Role. For example, the `getCourses` function only has `dynamodb:Query` permissions on the specified table, preventing unauthorized access to other AWS resources.
*   **S3 Content Protection:** The file storage bucket is private. Access to files is only available through temporary, time-limited presigned URLs (15-minute expiration).

> **[PLACEHOLDER: INSERT SCREENSHOT 5.1 - Browser padlock showing HTTPS status]**  
> **[PLACEHOLDER: INSERT SCREENSHOT 5.2 - AWS IAM Console showing a Lambda Role policy]**

---

## 6. Performance & Efficiency Optimization
To meet high-performance standards, the following optimizations were implemented:
*   **CDN Caching:** Static assets are cached at the edge.
*   **Database Query Optimization:** A Global Secondary Index (GSI) called `PublicCoursesIndex` was added to DynamoDB to allow instantaneous retrieval of public courses without scanning the entire table.
*   **API Gateway Caching:** Frequently accessed public data is cached at the API stage.

> **[PLACEHOLDER: INSERT SCREENSHOT 6.1 - Browser Inspector showing data loaded from cache]**

---

## 7. DevOps, Observability & Cost Management
Effective cloud management is demonstrated through automated monitoring:
*   **Observability:** CloudWatch Logs track every execution. If an error occurs, it is logged with a RequestId for easy tracing.
*   **Metrics:** We monitor `Invocations` to track usage patterns and `Duration` to optimize for costs.
*   **Cost Control:** The application is built to stay within the **AWS Free Tier**. Total operational cost is projected at **$0.00/month** for standard usage (up to 1M Lambda requests).

> **[PLACEHOLDER: INSERT SCREENSHOT 7.1 - CloudWatch Logs for a Lambda function]**  
> **[PLACEHOLDER: INSERT SCREENSHOT 7.2 - CloudWatch Metrics Graphs]**  
> **[PLACEHOLDER: INSERT SCREENSHOT 7.3 - AWS Billing Dashboard showing current spend]**

---

## 8. Conclusion & Demo Narrative
The **Course Study Planner** successfully integrates multiple managed cloud services into a unified, professional application. 

**Demo Workflow:**  
1.  Access the site via the CloudFront HTTPS link.
2.  Register and perform a login to demonstrate secure sessions.
3.  Create a "Cloud Project" course and add an assignment.
4.  Upload a "Project Requirements" PDF to demonstrate Object Storage integration.
5.  Toggle the course to 'Public' and view it on the Public Catalog page to showcase CDN delivery and NoSQL indexing.

> **[PLACEHOLDER: INSERT SCREENSHOT 8.1 - Final Live Demo screenshot of the full app]**

---
**END OF REPORT**
