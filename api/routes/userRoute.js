const express = require('express');
const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');
const autorizationMiddleware = require('../middleware/userAuthorisation');


const router = express.Router();


router.get('/hello', (req, res) => {
    res.send('Hello');
});

router.post('/signup', userAuth.saveUser, userController.signup);

router.post('/login', userController.login);

router.post('/logout', /**autorizationMiddleware,**/ userController.logout);
   


router.get('/check-auth', autorizationMiddleware, (req, res) => {
    
    res.status(200).json({ authenticated: true, user: req.session.username});
})


// routes nécissitant d'être loggué pour y accèder 
router.get('/userProfile', autorizationMiddleware, userController.getUserProfil);

router.get('/username', autorizationMiddleware, userController.getUserName);

router.put('/changePassword', autorizationMiddleware, userController.changePassword);
router.put('/changeUsername', autorizationMiddleware, userController.changeUsername);
router.put('/changeEmail', autorizationMiddleware, userController.changeEmail);
module.exports = router;