const express = require("express");
const { protect } = require("../../middleware/auth");
const { create } = require("../../controllers/order");
const router = express.Router();

// Create API
/**
 * @swagger
 * /api/order:
 *  post:
 *    tags: [Order]
 *    summary: Create new Order
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(protect, create);

module.exports = router;
