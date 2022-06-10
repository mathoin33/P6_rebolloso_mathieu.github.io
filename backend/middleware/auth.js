const jwt = require('jsonwebtoken');

//On autehtnifie l'user
module.exports = (req, res, next) => {
    try {
        //On supprime tout les espaces du token bearer
        const token = req.headers.authorization.split(' ')[1];
        //On décode le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //on récupère le userId
        const userId = decodedToken.userId;
        //Si l'userid est différent de l'userId dans l'headers.authorization alors l'utiloisateur n'est pas valide
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};