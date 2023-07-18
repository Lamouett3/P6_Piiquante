const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/controller");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Route pour obtenir toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauce);

// Route pour créer une nouvelle sauce
router.post("/", auth, multer, sauceCtrl.createSauce);

// Route pour obtenir une sauce spécifique
router.get("/:id", auth, sauceCtrl.getOneSauce);

// Route pour gérer les likes et les dislikes d'une sauce
router.post("/:id/like", auth, multer, sauceCtrl.likeOrDislike);

// Route pour modifier une sauce existante
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// Route pour supprimer une sauce existante
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router;
