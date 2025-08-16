const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// app.post('/api/summarize', async (req, res) => {
//   try {
//     const { transcript, prompt } = req.body;

//     if (!transcript || !transcript.trim()) {
//       return res.status(400).json({ error: 'Transcript is required' });
//     }

//     const systemPrompt = `You are an AI assistant specialized in summarizing meeting transcripts. Create clear, professional summaries based on the user's specific requirements.`;
    
//     const userPrompt = `${prompt || 'Summarize this meeting transcript professionally with key points, decisions, and action items.'}\n\nTranscript:\n${transcript}`;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt }
//       ],
//       max_tokens: 2000,
//       temperature: 0.3,
//     });

//     const summary = completion.choices[0].message.content;

//     res.json({ 
//       success: true, 
//       summary: summary,
//       tokens_used: completion.usage.total_tokens
//     });

//   } catch (error) {
//     console.error('Error in /api/summarize:', error);
    
//     if (error.code === 'insufficient_quota') {
//       return res.status(402).json({ 
//         error: 'OpenAI API quota exceeded. Please check your billing details.' 
//       });
//     }
    
//     res.status(500).json({ 
//       error: 'Failed to generate summary', 
//       details: error.message 
//     });
//   }
// });

app.post('/api/summarize-groq', async (req, res) => {
  try {
    const { transcript, prompt } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are an AI assistant specialized in summarizing meeting transcripts. Create clear, professional summaries based on the user's specific requirements in plain text and don't use any font weight or size formatting."
          },
          {
            role: "user",
            content: `${prompt || 'Summarize this meeting transcript professionally with key points, decisions, and action items.'}\n\nTranscript:\n${transcript}`
          }
        ],
        model: "llama3-8b-8192",
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    res.json({ 
      success: true, 
      summary: summary,
      provider: 'groq'
    });

  } catch (error) {
    console.error('Error in /api/summarize-groq:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary with Groq', 
      details: error.message 
    });
  }
});

app.post('/api/upload', upload.single('transcript'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype === 'text/plain') {
      const content = req.file.buffer.toString('utf8');
      return res.json({ content: content });
    }

    res.status(400).json({ 
      error: 'Please convert your document to .txt format and try again.' 
    });

  } catch (error) {
    console.error('Error in /api/upload:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
