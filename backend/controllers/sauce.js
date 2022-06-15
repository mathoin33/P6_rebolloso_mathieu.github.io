//On appel le model sauce qui contient toutes les données de la bdd
const Sauce = require('../models/sauce');

//Fs permet la suppresion de l'image lordque l'utilisateur supprime un post
const fs = require('fs');



exports.createSauce = (req, res, next) => {
    const sauce = new Sauce({
        name: req.body.name,
        manufacturer:req.body.manufacturer,
        description: req.body.description,
        heat:req.body.heat,
        imageUrl: req.body.imageUrl,
        mainPepper: req.body.mainPepper,
        userId: req.body.userId,
        heatValue: req.body.heatValue
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

//On créer une sauce
//req contient la requête que la bdd nous retourne
//res est la réponse attendus
//next passer au prochain middleware


//Récupération de toutes les sauces en bdd
exports.getAllSauce = (req, res, next) => {
    //Find permet de trouver toutes les sauces
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

//Trouver une sauce
exports.getOneSauce = (req, res, next) => {
    //permet de trouver juste une sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}


//Permet de modifier la sauce
exports.updateSauce = (req, res, next) => {
    //On regarde si l'image est aussi modifié avec les autres informations
    const sauceObj = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    //On mets à jour la bdd avec les nouvelles infos
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
}

//On supprime la sauce grâce a un id demandé et l'image du serveur grâce a FS
exports.deleteSauce = (req, res, next) => {
    //Avant de supprimé la sauce on la cherche en base s'avoir si elle existe bien
    Sauce.findOne({ _id: req.params.id })
        //Si la sauce est trouvé alors on continue
        .then(thing => {
            //Et on supprime l'img du server
            const filename = thing.imageUrl.split('/images/')[1];
            //Si l'img est vbien supprimé alors on supprime aussi les infos en bdd sinon on laisse tout
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
}

// Aimer ou pas une sauce
exports.likeOrNot = (req, res, next) => {
    //Like compte comme un 1, donc si on like c'est positif
    if (req.body.like === 1) {
        //Si l'user a liker alors on ajoute en bdd son like avec l'user id et le like et on incrémente le like si il y en a déjà en bdd
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    //Disklike est compter comme -1 donc négatif
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    //Si l'user a déjà liker ou disliker alors on passe en dessous
    } else {
        //On recherche le like/Dislike du post
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
}