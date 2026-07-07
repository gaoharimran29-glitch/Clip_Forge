<div align="center">

# 🎬 ClipForge

### **AI-Powered Viral Clip Generator**

Transform long-form YouTube videos into **high-retention, viral-ready vertical shorts** automatically using AI.

<p align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit-success?style=for-the-badge)](https://gaoharimranx.duckdns.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)

</p>

## **https://gaoharimranx.duckdns.org/**

---

ClipForge automates the entire content repurposing workflow—from downloading YouTube videos to producing **ready-to-post short-form clips**.

The complete AI pipeline:

🎥 Download YouTube Videos → 🎙️ Generate Ultra-fast Transcripts → 🧠 Analyze Viral Potential using LLMs → ✂️ Extract High-Retention Segments → 💬 Burn Dynamic Captions → ⚡ Stream Live Progress Updates → 📱 Export Vertical Shorts

</div>

---

# ✨ Features

- 🎥 Download YouTube videos using **yt-dlp**
- 🎙️ Ultra-fast speech transcription
- 🧠 AI-powered viral moment detection using LLMs
- ✂️ Automatic highlight extraction with FFmpeg
- 💬 Dynamic burned-in captions
- ⚡ Real-time progress updates using Server-Sent Events (SSE)
- 🚀 Parallel clip generation
- 📱 Beautiful responsive Next.js frontend
- 🐳 Fully Dockerized
- 🔄 GitHub Actions CI/CD pipeline
- ☁️ Production deployment on AWS EC2

---

# 🏗️ System Architecture

```text
                 +------------------+
                 |    Next.js UI    |
                 +---------+--------+
                           |
                    HTTP + SSE
                           |
                 +---------v--------+
                 |   FastAPI API    |
                 +---------+--------+
                           |
                    LangGraph Pipeline
                           |
      +----------+---------+----------+-----------+
      |          |                    |           |
 Download   Transcription     LLM Analysis   Clip Export
      |          |                    |           |
      +----------+---------+----------+-----------+
                           |
                    Generated Shorts
```
---

# 🔄 Workflow Graph

<p align="center">
  <img src="images/graph.png">
</p>

---

# 🎥 Demo

## Live Application

🚀 **https://gaoharimranx.duckdns.org/**

> Paste a YouTube URL and let ClipForge automatically generate viral-ready clips.

---

## Application Walkthrough

> *(Add a GIF or YouTube demo here later)*

```text
images/demo.gif
```

---

# 📸 Screenshots

## Home Page

```text
images/home.png
```

## Results

```text
images/results.png
```

---

# ⚙️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend

- FastAPI
- LangGraph
- LangChain
- Groq LLM
- Pydantic
- FFmpeg
- yt-dlp

## DevOps & Deployment

- Docker
- Docker Compose
- GitHub Actions
- AWS EC2

---

# 📂 Project Structure

```text
ClipForge/
│
├── backend/
│   ├── nodes/
│   ├── outputs/
│   ├── app.py
│   ├── graph.py
│   ├── state.py
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── ...
│
├── docker-compose.yml
├── .env.example
├── README.md
└── .github/
    └── workflows/
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/gaoharimran29-glitch/Clip_forge.git

cd Clip_forge
```

---

## Environment Variables

Create a `.env` file in the project root using the provided `.env.example`.

---

# 🐳 Running with Docker

```bash
docker compose up --build
```

Application will be available at

```text
http://localhost
```

---

# 💻 Local Development

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📡 API Processing Flow

```text
POST /generate
        │
        ▼
 Create Background Job
        │
        ▼
 Execute LangGraph Pipeline
        │
        ▼
 Stream Live Progress (SSE)
        │
        ▼
 Return Generated Clips
```

---

# 🚀 Deployment

ClipForge is production-ready and supports deployment with:

- Docker
- Docker Compose
- AWS EC2
- GitHub Actions CI/CD

Deployment workflow:

```text
Push to main
      │
      ▼
GitHub Actions
      │
      ▼
SSH into EC2
      │
      ▼
git fetch origin
      │
      ▼
git reset --hard origin/main
      │
      ▼
docker compose up --build -d
      │
      ▼
Application Updated 🚀
```

---

# 🤝 Contributing

Contributions, feature requests, and bug reports are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 🌟 Support

If you found ClipForge useful, please consider giving this repository a **⭐ Star**.

It helps others discover the project and motivates future development.

---

## 👤 Author

Built by **Gaohar Imran**
- GitHub: [@gaoharimran29-glitch](https://github.com/gaoharimran29-glitch)
- LinkedIn: [Gaohar Imran](https://www.linkedin.com/in/gaohar-imran-5a4063379/)

---