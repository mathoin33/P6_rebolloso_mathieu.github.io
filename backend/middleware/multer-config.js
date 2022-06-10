const multer = require('multer');

//on donnes en paramètre les img accepté
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//On crée le fichier de config
const storage = multer.diskStorage({
    //on crée le dossier images ou les img seront stocké
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //On définie a l'img son nom, la date, et son extension
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//On envoie l'img
module.exports = multer({storage: storage}).single('image');