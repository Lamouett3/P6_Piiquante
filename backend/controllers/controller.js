const Sauce = require("../models/Sauce");
const fs = require("fs");

// Crée une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  // Enregistre la sauce dans la base de données
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Modifie une sauce existante
exports.modifySauce = (req, res, next) => {
  // Recherche la sauce correspondante dans la base de données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        // Vérifie si l'utilisateur est autorisé à modifier la sauce
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        // Récupérer le nom du fichier de l'ancienne image
        const oldFilename = sauce.imageUrl.split("/images/")[1];

        // Mettre à jour l'image de la sauce, s'il y a un nouveau fichier
        const sauceObject = req.file
          ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : { ...req.body };

        delete sauceObject._userId;

        // Met à jour la sauce avec les nouvelles données
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => {
            // Si une nouvelle image a été ajoutée, supprimer l'ancienne image
            if (req.file) {
              fs.unlink(`images/${oldFilename}`, (err) => {
                if (err) {
                  console.error(
                    "Erreur lors de la suppression de l'ancienne image :",
                    err
                  );
                } else {
                  console.log("Ancienne image supprimée avec succès");
                }
              });
            }
            res.status(200).json({ message: "Objet modifié !" });
          })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Supprime une sauce existante
exports.deleteSauce = (req, res, next) => {
  // Recherche la sauce correspondante dans la base de données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        // Vérifie si l'utilisateur est autorisé à supprimer la sauce
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        // Supprime le fichier image associé à la sauce
        fs.unlink(`images/${filename}`, () => {
          // Supprime la sauce de la base de données
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Récupère les informations d'une sauce spécifique
exports.getOneSauce = (req, res, next) => {
  // Recherche la sauce correspondante dans la base de données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Récupère toutes les sauces
exports.getAllSauce = (req, res, next) => {
  // Récupère toutes les sauces dans la base de données
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Gère les likes et les dislikes pour une sauce spécifique
exports.likeOrDislike = (req, res, next) => {
  if (req.body.like === 1) {
    // Si l'utilisateur aime la sauce, ajoute un like et l'ajoute dans le tableau "usersLiked"
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    // Si l'utilisateur n'aime pas la sauce, ajoute un dislike et l'ajoute dans le tableau "usersDisliked"
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    // Si like === 0, l'utilisateur supprime son vote
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          // Si l'utilisateur avait précédemment liké la sauce, enlève son like
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Like supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          // Si l'utilisateur avait précédemment disliké la sauce, enlève son dislike
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Dislike supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
