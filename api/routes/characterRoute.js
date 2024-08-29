const express = require('express');
const characterController = require('../controllers/characterController');
const autorizationMiddleware = require('../middleware/userAuthorisation');

const router = express.Router();

/**
 * @swagger
 * /api/characters/create:
 *   post:
 *     summary: Create a new character with a name
 *     description: Créer un nouveau personnage avec un nom.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: XXdarth_vador3600XX
 *     responses:
 *       201:
 *         description: Personnage créé avec succès
 *       409:
 *         description: Erreur de validation du nom déjà pris
 *       500:
 *         description: Erreur lors de la création du personnage
 */
router.post('/create', autorizationMiddleware, characterController.createCharacter);

/**
 * @swagger
 * /api/characters/:
 *   get:
 *     summary: Get the characters of the current user.
 *     description: Récupère les personnages de l'utilisateur actuel.
 *     responses:
 *       200:
 *         description: Nom d'utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: XXdarth_vador3600XX
 *       404:
 *         description: L'utilisateur n'a pas de personnages
 *       500:
 *         description: Erreur lors de la recherche de personnages
 */
router.get('/', autorizationMiddleware, characterController.getCharacters);

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Retrieve a character by ID
 *     description: Recupere un personnage par son identifiant unique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID du personnage à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Personnage récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *       404:
 *         description: Le personnage n'a pas été trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Character not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
router.get('/:id', autorizationMiddleware, characterController.getCharacter);

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
 *         example: 1
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
 *       404:
 *         description: Le personnage désigné n'existe pas
 *       500:
 *         description: Erreur lors de la suppression du personnage
 */
router.delete('/delete/:id', autorizationMiddleware, characterController.deleteCharacter);

module.exports = router;