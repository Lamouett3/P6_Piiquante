const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const sauceRoutes = require("./routes/route");
const userRoutes = require("./routes/user");

// Connexion à la base de données avec mongoose
mongoose
  .connect(
    "mongodb+srv://user:Dropdead692@cluster0.ifa8own.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

// Configuration des en-têtes CORS pour autoriser les requêtes depuis n'importe quelle origine
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

// Routes pour les fonctionnalités d'authentification des utilisateurs
app.use("/api/auth", userRoutes);

// Routes pour les fonctionnalités de gestion des sauces
app.use("/api/sauces", sauceRoutes);

// Route pour servir les fichiers images statiques
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
