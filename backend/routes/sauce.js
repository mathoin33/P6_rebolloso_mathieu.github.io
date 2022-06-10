const express = require('express');
const router = express.Router();

//On appel le middleware de connexion pour sécurisé l'api et véridfier que l'user est bien connecter
const auth = require('../middleware/auth');

//On appel multer pour uploader/modifier des images
const multer = require('../middleware/multer-config');

//On fait appel au coontroller qui contient toute nos fonctions
const sauceCtrl = require('../controllers/sauce');

//on définie les routes afin de taper sur les bonnes fonction et faire ce qu'on veut
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrNot)

module.exports = router;