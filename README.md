# GroupChatting

A real-time group chatting application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. This application allows users to create accounts, join chat rooms, and exchange messages instantly.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.io.
- **User Authentication**: Secure signup and login using JWT and Bcrypt.
- **Group Chats**: Create and join group conversations.
- **Multimedia Support**: Share images in chats (powered by Cloudinary).
- **Responsive Design**: Fully responsive UI built with TailwindCSS.
- **State Management**: Efficient state management using Recoil.
- **Notifications**: Real-time notifications for new messages (Sound effects included).

## 📸 Screenshots

<!-- Add your screenshots here -->
[![Clean-Shot-2025-11-22-at-23-44-38-2x.png](https://i.postimg.cc/5tv9YGSh/Clean-Shot-2025-11-22-at-23-44-38-2x.png)](https://postimg.cc/KKGhC0Vf)
[![Clean-Shot-2025-11-22-at-23-41-51-2x.png](https://i.postimg.cc/gkdhYym2/Clean-Shot-2025-11-22-at-23-41-51-2x.png)](https://postimg.cc/fk2yC9VG)
[![Clean-Shot-2025-11-22-at-23-42-52-2x.png](https://i.postimg.cc/mk4PgRfF/Clean-Shot-2025-11-22-at-23-42-52-2x.png)](https://postimg.cc/njdF3yLH)
[![Clean-Shot-2025-11-22-at-23-43-49-2x.png](https://i.postimg.cc/9XBMY6HF/Clean-Shot-2025-11-22-at-23-43-49-2x.png)](https://postimg.cc/nMCpHwL6)


## 🎥 Demo

<!-- Add your demo video here -->

*Click the image above to watch the demo video*

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building interactive interfaces.
- **Vite**: Next Generation Frontend Tooling.
- **TailwindCSS**: Utility-first CSS framework.
- **Recoil**: State management library for React.
- **Socket.io-client**: Real-time bidirectional event-based communication.
- **Axios**: Promise based HTTP client.
- **Framer Motion**: Production-ready motion library for React.
- **Lucide React**: Beautiful & consistent icons.

### Backend
- **Node.js**: JavaScript runtime built on Chrome's V8 engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: Elegant mongodb object modeling for node.js.
- **Socket.io**: Enables real-time, bidirectional and event-based communication.
- **Cloudinary**: Cloud service for image and video management.
- **JWT (JSON Web Tokens)**: Securely transmitting information between parties as a JSON object.

## 📋 Prerequisites

Before running the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GroupChatting
   ```

2. **Backend Setup**
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Environment Variables

### Backend
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ORIGIN=http://localhost:5173
```

### Frontend
Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_BASE_API=http://localhost:5000
```

## 🚀 Running the App

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.