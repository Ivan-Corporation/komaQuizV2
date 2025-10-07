# 🧠 KomaQuiz V2 - AI-Powered Quiz Platform with Web3 Integration

A full-stack decentralized quiz platform featuring AI-generated content, blockchain achievements, and token rewards.

## 🚀 Tech Stack

### 🔗 Blockchain & Smart Contracts

* **Solidity 0.8.20** - Smart contract development
* **Hardhat** - Development framework with toolbox
* **Ethers.js** - Blockchain interactions
* **Arbitrum & Arbitrum Sepolia** - L2 scaling solutions
* **ERC20** - XP Token for rewards
* **SBT (Soulbound Tokens)** - Non-transferable achievement NFTs

### 🐍 Backend (FastAPI)

* **FastAPI** - Modern Python web framework
* **SQLAlchemy** - ORM and database management
* **Alembic** - Database migrations
* **PostgreSQL** - Primary database
* **JWT Authentication** - Secure user sessions
* **Pydantic** - Data validation and serialization
* **Python-dotenv** - Environment configuration
* **Uvicorn** - ASGI server
* **Passlib[bcrypt]** - Password hashing
* **Python-jose[cryptography]** - JWT token handling

### ⚛️ Frontend (React + TypeScript)

* **React 19** - UI library with latest features
* **TypeScript** - Type-safe JavaScript
* **Vite** - Fast build tool and dev server
* **Tailwind CSS 4** - Utility-first CSS framework
* **Ethers.js** - Web3 interactions
* **Reown AppKit** - Wallet connection management
* **Framer Motion** - Animation library
* **React Router DOM** - Client-side routing
* **Zustand** - State management
* **Axios** - HTTP client
* **Recharts** - Data visualization
* **React Hot Toast** - Notifications

## 🛠️ Quick Start

### Prerequisites

* Node.js 18+
* Python 3.9+
* PostgreSQL
* MetaMask or compatible wallet

### 1. Smart Contracts Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your keys:
# ALCHEMY_API_KEY=
# PRIVATE_KEY=
# ARBISCAN_API_KEY=

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Arbitrum Sepolia
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
.\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your configuration:
# DATABASE_URL=postgresql://user:pass@localhost:5432/quizdb
# SECRET_KEY=your-secret-key
# ALCHEMY_API_KEY=your-alchemy-key

# Setup database
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

API documentation available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your configuration:
# VITE_API_URL=http://localhost:8000
# VITE_CONTRACT_ADDRESS=0x...

# Start development server
npm run dev
```


### 4. Local model (optional)
```
cd backend

.\venv\Scripts\Activate.ps1

uvicorn app.localModelAI.local_model_server:app --host 0.0.0.0 --port 5005 --log-level debug

```

Frontend runs at: [http://localhost:5173](http://localhost:5173)

## 📋 Environment Variables

### Smart Contracts (.env)

```env
ALCHEMY_API_KEY=your-alchemy-key
PRIVATE_KEY=your-wallet-private-key
ARBISCAN_API_KEY=your-arbiscan-api-key
```

### Backend (.env)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/quizdb
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
HUGGING_FACE_TOKEN=your-hf-token
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
VITE_CONTRACT_ADDRESS=0x...
VITE_PROJECT_ID=your-walletconnect-project-id
```

## 🎯 Core Features

### Quiz System

* 🧠 AI-generated quiz content
* 📊 Real-time analytics and scoring
* 🏆 Theme-based achievements
* 📈 Progress tracking

### Web3 Integration

* 💰 XP Token rewards (ERC20)
* 🎖️ Soulbound Achievement NFTs (SBT)
* 🔐 Secure wallet authentication
* ⛽ Gas-optimized on Arbitrum

### User Experience

* ⚡ Fast, responsive interface
* 🎨 Modern, accessible design
* 📱 Mobile-friendly layout
* 🔔 Real-time notifications

## 🔌 API Endpoints V1 (now more)

### Authentication

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | /auth/login    | User login        |
| POST   | /auth/register | User registration |

### Quizzes

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | /quizzes/         | List all quizzes    |
| GET    | /quizzes/{id}     | Get specific quiz   |
| POST   | /quizzes/submit   | Submit quiz answers |
| POST   | /quizzes/generate | AI quiz generation  |

### Users & Analytics

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| GET    | /users/{id}          | Get user profile        |
| GET    | /analytics/user/{id} | User progress analytics |
| GET    | /analytics/global    | Platform-wide stats     |

## 🔐 Smart Contracts

### XPToken (ERC20)

* Mintable XP tokens for quiz rewards
* Controlled distribution through backend
* Burn functionality for token utility

### AchievementSBT

* Soulbound tokens for achievements
* Non-transferable NFT badges
* Metadata for achievement details

## 🚀 Deployment

### Smart Contracts

```bash
# Deploy to Arbitrum Mainnet
npx hardhat run scripts/deploy.js --network arbitrum

# Verify on Arbiscan
npx hardhat verify --network arbitrum <CONTRACT_ADDRESS>
```

### Backend

```bash
# Production deployment
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Future Enhancements

* Multi-chain deployment
* Advanced AI quiz personalization
* Social features and leaderboards
* Mobile app development
* DAO governance for quiz curation
* Cross-platform achievement system

## 🛡️ Security Features

* JWT token-based authentication
* Password hashing with bcrypt
* CORS protection
* Input validation with Pydantic
* Secure smart contract patterns
* Gas optimization for L2

## 📄 License

MIT License - feel free to use, modify, and build upon this project.

Built with ❤️ for the Web3 ecosystem
