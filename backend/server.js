import express from 'express';
import { faker } from '@faker-js/faker';
const port = process.env.PORT || 3000;
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json({
  type(req) {
    return true;
  },
}));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

function createRandomMessage() {
  return {
    id: faker.string.uuid(),
    from: faker.internet.email(),
    subject: faker.lorem.words(3),
    body: faker.lorem.sentences(3),
    received: faker.date.past().getTime()
  };
}

const MESSAGES = Array.from({ length: 5 }, createRandomMessage);

app.get('/messages/unread', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    messages: MESSAGES,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});