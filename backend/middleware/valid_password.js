const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'le mot de passe doit contenir au moins 7 charactère, 1 chiffres, une majuscule et une minuscule.'});
    } else {
        next();
    }
};