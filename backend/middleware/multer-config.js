const multer = require("multer");

// Types de fichiers acceptés et leurs extensions correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Spécifie le répertoire de destination pour enregistrer les fichiers
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // Génère un nom de fichier unique
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exporte le middleware multer configuré avec le stockage spécifié et limite à un seul fichier
module.exports = multer({ storage: storage }).single("image");
