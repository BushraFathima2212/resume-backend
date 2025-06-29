const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

app.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: "system", content: "You are a resume analyzer." },
        { role: "user", content: `Please review this resume:\n\n${text}` }
      ],
    });

    res.json({ result: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));