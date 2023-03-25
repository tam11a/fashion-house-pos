const express = require("express");
const { byID } = require("../../controllers/scan");
const { protect } = require("../../middleware/auth");
const router = express.Router();

// Get Scan API
/**
 * @swagger
 * /api/scan/{id}:
 *  get:
 *    tags: [Scan]
 *    summary: Get Scan Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Scan Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:scan_id").get(protect, byID);

module.exports = router;
