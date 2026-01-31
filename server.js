import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/content', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      return res.json({
        hero: { title: "Hello Shopify", subtitle: "It works!", buttonText: "Click Me" },
        features: []
      });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/update-content', (req, res) => {
  fs.writeFile('./db.json', JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).send("Save Error");
    res.send({ message: "Saved" });
  });
});
app.listen(5000, () => console.log('Backend running on port 5000'));