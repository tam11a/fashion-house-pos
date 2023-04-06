const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { query } = require("../../middleware/query");
const { getAll, create } = require("../../controllers/petty-cash");

// Get Petty Cash List - API
/**
 * @swagger
 * /api/petty-cash:
 *  get:
 *    tags: [Petty Cash]
 *    summary: Get Petty Cash List
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: query
 *        name: branch
 *        type: string
 *      - in: query
 *        name: search
 *        type: string
 *      - in: query
 *        name: limit
 *        type: string
 *      - in: query
 *        name: page
 *        type: string
 *      - in: query
 *        name: sort
 *        type: string
 *      - in: query
 *        name: createdBy
 *        type: string
 *      - in: query
 *        name: startDate
 *        type: date
 *      - in: query
 *        name: endDate
 *        type: date
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/").get(protect, query, getAll);

// Create Petty Cash - API
/**
 * @swagger
 * /api/petty-cash/{branchId}:
 *  post:
 *    tags: [Petty Cash]
 *    summary: Create Petty Cash
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: branchId
 *        required: true
 *        type: string
 *        description: Branch Id
 *      - in: query
 *        name: amount
 *        required: true
 *        type: string
 *        description: Amount of Expense
 *      - in: query
 *        name: reason
 *        required: true
 *        type: string
 *        description: Reason of Expense
 *    responses:
 *      201:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:branch").post(protect, create);

module.exports = router;
