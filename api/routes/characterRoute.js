const express = require('express');
const characterController = require('../controllers/characterController');
const autorizationMiddleware = require('../middleware/userAuthorisation');

const router = express.Router();

/**
 * @swagger
 * /api/characters/create:
 *  post:
 *   summary: Création d'un nouveau personnage
 *   description: Créer un nouveau personnage avec un nom.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - name
 *       properties:
 *        name:
 *         type: string
 *         example: XXdarth_vador3600XX
 *   responses:
 *    201:
 *     description: Personnage créé avec succès
 *    409:
 *     description: Erreur de validation du nom déjà pris
 *    500:
 *     description: Erreur lors de la création du personnage
 */
router.post('/create', autorizationMiddleware, characterController.createCharacter);

/**
 * @swagger
 * /api/characters/:
 *  get:
 *   summary: Get the characters of the current user.
 *   description: Récupère les personnages de l'utilisateur actuel.
 *   responses:
 *    200:
 *     description: Personnages récupérés avec succès
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         TO DO
 *    404:
 *      decription: L'utilisateur n'a pas de personnages
 *    500:
 *     description: Erreur lors de la recherce de personnages
 */
router.get('/', autorizationMiddleware, characterController.getCharacters);

/**
 * @swagger
 * /api/characters/delete/{id}:
 *   delete:
 *     summary: Delete a character
 *     description: Cette route permet de supprimer un personnage en utilisant son identifiant unique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'identifiant unique du personnage à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Personnage supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Character successfully deleted
 */
router.delete('/delete/:id', autorizationMiddleware, characterController.deleteCharacter);

module.exports = router;