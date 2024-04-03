import express from 'express';

const app = express();
const PORT = process.env.API_PORT || 3000;

app.get('/', (_, res) => {
  res.send('Starter project!');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`);
});
