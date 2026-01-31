import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Serve the static files from the Vite 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/content', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send("Read Error");
    res.json(JSON.parse(data));
  });
});

app.post('/api/update-content', (req, res) => {
  fs.writeFile('./db.json', JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).send("Save Error");
    res.send({ message: "Saved" });
  });
});

// 2. Catch-all route to serve index.html for any non-API request
// Using '*splat' for Express 5 compatibility
app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));