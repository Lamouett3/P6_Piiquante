const jwt = require("jsonwebtoken");

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    // Récupération du token d'authentification depuis les en-têtes de la requête
    const token = req.headers.authorization.split(" ")[1];
    // Vérification et décodage du token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // Extraction de l'ID utilisateur depuis le token décodé
    const userId = decodedToken.userId;
    // Ajout de l'ID utilisateur à l'objet `auth` de la requête
    req.auth = {
      userId: userId,
    };
    // Passez au middleware suivant
    next();
  } catch (error) {
    // En cas d'erreur lors de la validation du token
    res.status(401).json({ error });
  }
};
