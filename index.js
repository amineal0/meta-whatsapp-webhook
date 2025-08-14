const express = require("express");
const app = express();

app.use(express.json());

// ⚙️ Variables (mets la vraie valeur de VERIFY_TOKEN dans Render > Environment)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "mon_token_secret";

// ✅ Endpoint de vérification du webhook (appelé une seule fois par Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✔️ Webhook vérifié par Meta.");
    return res.status(200).send(challenge);
  }
  console.log("❌ Vérification échouée.");
  return res.sendStatus(403);
});

// 📩 Réception des messages entrants WhatsApp
app.post("/webhook", (req, res) => {
  console.log("📨 Message entrant :", JSON.stringify(req.body, null, 2));
  // 👉 Ici tu peux traiter le message, répondre via l'API WhatsApp, etc.
  res.sendStatus(200);
});

// 🌐 Page d’accueil simple (pour vérifier que le service tourne)
app.get("/", (_req, res) => {
  res.send("Webhook WhatsApp Cloud API actif ✅");
});

// 🚀 Lancer le serveur (Render injecte PORT en variable d'environnement)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur port ${PORT}`));
