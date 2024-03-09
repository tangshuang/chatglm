const dotenv = require('dotenv');
const { ChatGLM, CogView, CharacterGLM } = require('../index');
const express = require('express');
const path = require('path');

dotenv.config();

const chatglm = new ChatGLM(process.env.API_KEY);
const cogview = new CogView(process.env.API_KEY);
const character = new CharacterGLM(process.env.API_KEY);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  const { data } = await chatglm.completions.create({
    model: 'glm-4',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  res.json(data);
});

app.post('/chat_stream', async (req, res) => {
  const { prompt } = req.body;
  try {
    const { data } = await chatglm.completions.create({
      model: 'glm-4',
      stream: true,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    data.pipe(res);
  }
  catch (e) {
    console.error(e.toJSON());
  }
});

app.post('/draw', async (req, res) => {
  const { prompt } = req.body;
  const { data } = await cogview.images.generations({
    model: 'cogview-3',
    prompt,
  });
  res.json(data);
});

app.post('/character', async (req, res) => {
  const { prompt, meta } = req.body;
  const { data } = await character.sse.invoke({
    model: 'charglm-3',
    meta,
    prompt,
  });
  data.pipe(res);
});

app.get('/character.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'character.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(process.env.PORT);
