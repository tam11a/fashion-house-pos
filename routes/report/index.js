const express = require("express");
const { protect } = require("../../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /api/report/global:
 *  get:
 *    tags: [Report]
 *    summary: Get Global Report
 *    security:
 *      - bearer: []
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router
	.route("/global")
	.get(protect, require("../../controllers/report").global);

module.exports = router;
