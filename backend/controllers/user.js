const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Charge les variables d'environnement
require("dotenv").config();

const User = require("../models/User");

// Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Hashage du mot de passe
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Enregistrement de l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      // Vérification de l'existence de l'utilisateur dans la base de données
      return res
        .status(401)
        .json({ error: "Paire identifiant/mot de passe incorrect" });
    }
    bcrypt
      .compare(req.body.password, user.password)
      .then((valid) => {
        if (!valid) {
          // Comparaison du mot de passe fourni avec le mot de passe haché de l'utilisateur
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        // Si les identifiants sont valides, création d'un token d'authentification
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, `${process.env.TOKEN}`, {
            expiresIn: "24h",
          }),
        });
      })
      .catch((error) => res.status(500).json({ error }));
  });
};
