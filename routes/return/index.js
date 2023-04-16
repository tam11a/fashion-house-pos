const express = require("express");
const { protect } = require("../../middleware/auth");
const { byID } = require("../../controllers/return");
const router = express.Router();

// Return API
/**
 * @swagger
 * /api/return/{id}:
 *  post:
 *    tags: [Return]
 *    summary: Return Product
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Item Id
 *    responses:
 *      201:
 *        description: Return successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

router.route("/:scan_id").post(protect, byID);

module.exports = router;
