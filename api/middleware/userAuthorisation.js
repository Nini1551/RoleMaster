
const autorizationMiddleware = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        res.status(401).send('Vous devez vous connecté pour accèder à cette ressource');
    }
    

};

module.exports = autorizationMiddleware;