const express = require('express');
const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');
const autorizationMiddleware = require('../middleware/userAuthorisation');


const router = express.Router();


router.get('/hello', (req, res) => {
    res.send('Hello');
});

/**
 * @swagger
 * /api/users/signup:
 *  post:
 *   summary: Inscription d'un nouvel utilisateur
 *   description: Crée un nouvel utilisateur avec un nom d'utilisateur, un email et un mot de passe.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - username
 *        - email
 *        - password
 *       properties:
 *        username:
 *         type: string
 *         example: john_doe
 *        email:
 *         type: string
 *         example: john.doe@example.com
 *        password:
 *         type: string
 *         example: John_Doe123
 *   responses:
 *    201:
 *     description: Utilisateur créé avec succès
 *    409:
 *     description: Erreur de validation email ou username déjà pris
 *    500:
 *     description: Erreur lors de l'inscription de l'utilisateur
 */
router.post('/signup', userAuth.saveUser, userController.signup);

/**
 * @swagger
 * /api/users/login:
 *  post:
 *   summary: Authenticate a user
 *   description: Authentifie un utilisateur.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - email
 *        - password
 *       properties:
 *        email:
 *         type: string
 *         example: john.doe@example.com
 *        password:
 *         type: string
 *         example: John_Doe123
 *   responses:
 *    200:
 *     description: Authentification réussie
 *    401:
 *     description: Non autorisé
 *    500:
 *     description: Erreur lors de l'authentification de l'utilisateur
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/logout:
 *  post:
 *   summary: Logout a user
 *   description: Déconnecte un utilisateur.
 *   responses:
 *    200:
 *     description: Déconnexion réussie
 *    401:
 *      description: Utilisateur non connecté
 *    500:
 *     description: Erreur lors de la déconnexion
 */
router.post('/logout', autorizationMiddleware, userController.logout);
   

/**
 * @swagger
 * /api/users/check-auth:
 *  get:
 *   summary: Check if user is authenticated
 *   description: Vérifie l'état d'authentification de l'utilisateur.
 *   responses:
 *    200:
 *     description: Utilisateur authentifié
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         authenticated:
 *          type: boolean
 *          example: true
 *         user:
 *          type: string
 *          example: john_doe
 *    401:
 *     description: Non autorisé
 */
router.get('/check-auth', autorizationMiddleware, (req, res) => {
    
    res.status(200).json({ authenticated: true, user: req.session.username});
})


// routes nécissitant d'être loggué pour y accèder 

/**
 * @swagger
 * /api/users/userProfile:
 *  get:
 *   summary: Get the profile of the authenticated user
 *   description: Récupère le profil de l'utilisateur connecté.
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Profil utilisateur récupéré avec succès
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         username:
 *          type: string
 *          example: john_doe
 *         email:
 *          type: string
 *          example: john.doe@example.com
 *    401:
 *     description: Non autorisé
 */
router.get('/userProfile', autorizationMiddleware, userController.getUserProfil);

/**
 * @swagger
 * /api/users/username:
 *  get:
 *   summary: Get the username of the authenticated user
 *   description: Récupère le nom d'utilisateur de l'utilisateur connecté.
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Nom d'utilisateur récupéré avec succès
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         username:
 *          type: string
 *          example: john_doe
 *    401:
 *     description: Non autorisé
 */
router.get('/username', autorizationMiddleware, userController.getUserName);

/**
 * @swagger
 * /api/users/changePassword:
 *  put:
 *   summary: Change the user's password
 *   description: Change le mot de passe de l'utilisateur.
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - oldPassword
 *        - newPassword
 *       properties:
 *        oldPassword:
 *         type: string
 *         example: OldPass123
 *        newPassword:
 *         type: string
 *         example: NewPass123
 *   responses:
 *    200:
 *     description: Mot de passe changé avec succès
 *    401:
 *     description: Non autorisé
 *    404:
 *     description: Utilisateur Introuvable
 *    500:
 *     description: Erreur lors du changement de mot de passe
 */
router.put('/changePassword', autorizationMiddleware, userController.changePassword);

/**
 * @swagger
 * /api/users/changeUsername:
 *  put:
 *   summary: Change the user's username
 *   description: Change le nom d'utilisateur de l'utilisateur.
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - newUsername
 *       properties:
 *        newUsername:
 *         type: string
 *         example: new_john_doe
 *   responses:
 *    200:
 *     description: Nom d'utilisateur changé avec succès
 *    401:
 *     description: Non autorisé
 *    404:
 *     description: Utilisateur introuvable
 *    500:
 *     description: Erreur lors du changement de nom d'utilisateur
 */
router.put('/changeUsername', autorizationMiddleware, userController.changeUsername);

/**
 * @swagger
 * /api/users/changeEmail:
 *  put:
 *   summary: Change the user's email address
 *   description: Change l'adresse e-mail de l'utilisateur.
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - newEmail
 *       properties:
 *        newEmail:
 *         type: string
 *         example: new.email@example.com
 *   responses:
 *    200:
 *     description: Adresse e-mail changée avec succès
 *    401:
 *     description: Non autorisé
 *    404:
 *     description: Utilisateur introuvable
 *    500:
 *     description: Erreur lors du changement d'adresse e-mail
 */
router.put('/changeEmail', autorizationMiddleware, userController.changeEmail);
module.exports = router;