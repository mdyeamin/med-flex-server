# MedFlex Backend API

This is the backend server for the **MedFlex** medical and doctor appointment booking platform. It provides a robust RESTful API to manage doctors, patients, and booking functionalities. The server is built with Node.js, Express.js, and MongoDB, featuring secure JWT authentication via remote JWKS.

## 🚀 Technologies Used

*   **Runtime Environment:** Node.js
*   **Web Framework:** Express.js
*   **Database:** MongoDB (MongoDB Native Driver)
*   **Authentication & Security:** 
    *   `jose-cjs` (For verifying JWT tokens using remote JSON Web Key Sets - JWKS)
    *   `cors` (Cross-Origin Resource Sharing)
*   **Environment Management:** `dotenv`

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=your_frontend_application_url