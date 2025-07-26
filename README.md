# ♟️ Chess Game - Multiplayer & AI Chess Platform

<div align="center">

![Chess Game](https://img.shields.io/badge/Chess-Game-8B4513?style=for-the-badge&logo=chess)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io)
![Stockfish](https://img.shields.io/badge/Stockfish-AI-000000?style=for-the-badge&logo=chess)

*A modern, feature-rich chess game with multiplayer support and AI opponent powered by Stockfish*

[🚀 Live Demo](#) • [📖 Features](#-features) • [🛠️ Installation](#-installation) • [🎮 Usage](#-usage) • [🏗️ Architecture](#-architecture) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 Overview

This is a full-stack chess application that combines the classic game of chess with modern web technologies. Players can enjoy chess in two exciting modes:

- **🤖 AI Mode**: Challenge the powerful Stockfish chess engine
- **👥 Multiplayer Mode**: Play real-time chess with friends online

Built with React, Node.js, Socket.IO, and powered by the world's strongest chess engine, this application provides an immersive chess experience with beautiful UI and smooth gameplay.

## ✨ Features

### 🎮 Game Modes
- **AI Challenge**: Play against Stockfish chess engine with adjustable difficulty
- **Real-time Multiplayer**: Create or join rooms to play with friends
- **Room Management**: Generate unique room codes for private games

### 🎨 User Experience
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Dark/Light Theme**: Toggle between themes for comfortable play
- **Real-time Updates**: Instant game state synchronization
- **Move Validation**: Automatic chess rule enforcement
- **Game Status**: Real-time game over detection and winner announcement

### 🛠️ Technical Features
- **WebSocket Communication**: Real-time multiplayer functionality
- **Chess.js Integration**: Robust chess logic and move validation
- **Stockfish AI**: World-class chess engine for challenging gameplay
- **React Chessboard**: Professional chess board component
- **Toast Notifications**: User-friendly feedback system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/qobulovasror/chess-game
   cd chess-game
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development servers**

   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start playing!

## 🎮 How to Play

### Playing Against AI
1. Click "Play with AI 🤖" on the home page
2. You'll play as white against the Stockfish engine
3. Make your moves by dragging pieces on the board
4. The AI will automatically respond with its moves
5. The game ends when checkmate, stalemate, or draw conditions are met

### Playing Multiplayer
1. Click "Multiplayer 🏆" on the home page
2. **To create a game:**
   - Enter your username
   - Click "Create Game"
   - Share the generated room code with your friend
3. **To join a game:**
   - Enter your username
   - Enter the room code provided by your friend
   - Click "Join Game"
4. Both players will see the chess board once connected
5. The creator plays as white, the joiner as black

## 🏗️ Architecture

### Frontend (Client)
- **React 19**: Modern UI framework with hooks
- **React Router**: Client-side routing
- **React Chessboard**: Professional chess board component
- **Chess.js**: Chess logic and move validation
- **Socket.IO Client**: Real-time communication
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **Lucide React**: Beautiful icons

### Backend (Server)
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Socket.IO**: Real-time bidirectional communication
- **UUID**: Unique room ID generation

### Key Libraries
- **Stockfish**: Chess engine for AI gameplay
- **React Confetti**: Celebration effects
- **React Toastify**: Notification system

## 📁 Project Structure

```
chess-game/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── page/          # Main page components
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Game.jsx           # Chess game component
│   │   │   ├── Multiplyer.jsx     # Multiplayer setup
│   │   │   └── PlayWithComp.jsx   # AI game component
│   │   ├── lib/           # Utility functions
│   │   └── socket.js      # Socket.IO configuration
│   └── public/            # Static assets
├── server/                # Node.js backend
│   └── index.js           # Express server & Socket.IO logic
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
The application uses default configurations, but you can customize:

**Server (server/index.js):**
- Port: Default 3000 (can be changed via PORT environment variable)
- CORS: Configured to allow all origins for development

**Client (client/src/socket.js):**
- Socket.IO server URL: Default localhost:3000

## 🎯 Game Features

### Chess Rules Implementation
- ✅ All standard chess moves
- ✅ Special moves (castling, en passant, pawn promotion)
- ✅ Check and checkmate detection
- ✅ Stalemate and draw conditions
- ✅ Move validation and illegal move prevention

### AI Features
- 🧠 Stockfish 16 chess engine
- ⚡ Real-time move calculation
- 🎯 Adjustable difficulty levels
- ⏱️ Time management for AI moves

### Multiplayer Features
- 🔗 Real-time game synchronization
- 👥 Room-based matchmaking
- 💬 Player disconnection handling
- 🎮 Automatic game state management

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test both multiplayer and AI modes
- Ensure responsive design works on mobile devices

## 🐛 Known Issues & Limitations

- AI moves may take a few seconds on slower devices
- Multiplayer requires both players to be online simultaneously
- Room codes are temporary and not persistent across server restarts

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Qobulov Asror** - [GitHub Profile](https://github.com/qobulovasror)

## 🙏 Acknowledgments

- [Stockfish](https://stockfishchess.org/) - The chess engine that powers the AI
- [Chess.js](https://github.com/jhlywa/chess.js) - Chess logic library
- [React Chessboard](https://github.com/Clariity/react-chessboard) - Chess board component
- [Socket.IO](https://socket.io/) - Real-time communication library

---

<div align="center">

**Made with ♟️ and ❤️**

[⬆ Back to top](#-chess-game---multiplayer--ai-chess-platform)

</div>
