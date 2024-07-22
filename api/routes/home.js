const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *   description: Get a confirmation from RoleMaster API
 *   responses:
 *    200:
 *     description: Success
 *    500:
 *     description: Error API connection
 */
router.get('/', (req, res) => {
  res.json({ message: 'Hello from RoleMaster API!' });
});

module.exports = router;