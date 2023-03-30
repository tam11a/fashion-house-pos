const express = require("express");
const { getAll, deleteBranchJunction } = require("../../controllers/branchjunction");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { query } = require("../../middleware/query");

// Get All API
/**
 * @swagger
 * /api/branchjunction:
 *  get:
 *    tags: [Branch]
 *    summary: Get All Branch Junctions
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: query
 *        name: branch
 *        type: string
 *      - in: query
 *        name: employee
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(protect, query, getAll);

// Delete Junction API
/**
 * @swagger
 * /api/branchjunction/{id}:
 *  delete:
 *    tags: [Branch]
 *    summary: Delete Junction
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: Delete Successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:id").delete(protect, deleteBranchJunction);

module.exports = router;