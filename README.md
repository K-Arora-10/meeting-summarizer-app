# AI Meeting Notes Summarizer

## Overview
A web application that generates concise meeting summaries from uploaded transcripts and allows sharing them via email.

**Features:**
- Upload `.txt` transcripts
- Custom summarization prompts
- AI-generated summaries (Groq primary, OpenAI fallback)
- Real-time editing
- Multi-recipient email sharing

---

## Architecture
- **Frontend:** Static SPA (HTML, CSS, Vanilla JS)
- **Backend:** Node.js + Express REST API
- **Communication:** JSON over HTTP
- **Hosting:** Vercel (frontend), Render (backend)

---

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JS, EmailJS
- **Backend:** Node.js, Express, Multer, CORS, dotenv
- **AI:** Groq (Llama3-8b-8192), OpenAI (gpt-3.5-turbo fallback)
- **Deployment:** Vercel (frontend), Render (backend)

---

## API Endpoints
```
GET  /health
POST /api/summarize
POST /api/summarize-groq
POST /api/upload
```

**Example Request**
```json
{
  "transcript": "Meeting content...",
  "prompt": "Summarize as action points"
}
```

**Example Response**
```json
{
  "success": true,
  "summary": "Generated summary...",
  "provider": "groq"
}
```

---

## Deployment
- **Backend (Render):** GitHub integration, env vars, health checks
- **Frontend (Vercel):** Static hosting, automatic builds, HTTPS

---

## Future Enhancements
- Support `.docx` and `.pdf` uploads
- Export summaries (PDF/Word)
- Pre-built summary templates
- Authentication and history
- Audio transcription with Whisper
- Team collaboration and Slack/Teams integration

---

## Conclusion
This system provides a lightweight, cost-effective solution for summarizing and sharing meeting notes. Built with a minimal stack, it is production-ready, scalable, and easy to maintain with Vercel and Render hosting.
