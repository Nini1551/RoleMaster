const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

/**
 * @swagger
 * /auth/register:
 *  post:
 *   description: Register a new user
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
 *     description: Created
 *    500:
 *     description: Error registering user
 */
router.post('/register', authController.registerUser);

/**
 * @swagger
 * /auth/users:
 *  get:
 *   description: Get all usernames and emails
 *   responses:
 *    200:
 *     description: Success
 *    500:
 *     description: Error fetching users
 */
router.get('/users', authController.getUsers);


/**
 * @swagger
 * /auth/login:
 *  post:
 *   description: Check if email exists, if true compare password(hashed), else return unvalid data.
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
 *     description: Success login in
 *    500:
 *     description: Error Logging in
 */
router.post('/login', authController.loginUser);

module.exports = router;