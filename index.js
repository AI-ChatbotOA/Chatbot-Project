const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());

// Ruta para manejar las solicitudes de chat
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Solicitud a la API de OpenAI
    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text();
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Algo salió mal" });
  }
});

// Ruta para servir el archivo HTML
app.get("/", (req, res) => {
  const path = require("path");
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
