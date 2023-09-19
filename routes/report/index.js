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

/**
 * @swagger
 * /api/report/range:
 *  get:
 *    tags: [Report]
 *    summary: Get Range Report
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: query
 *        name: branch
 *        type: string
 *      - in: query
 *        name: fromDate
 *        type: date
 *      - in: query
 *        name: toDate
 *        type: date
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/range").get(protect, require("../../controllers/report").range);

module.exports = router;
