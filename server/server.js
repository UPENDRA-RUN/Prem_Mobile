import app from './index.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Prem Mobile Server] Running on port ${PORT}`);
});
