const express = require("express");
const { protect } = require("../../middleware/auth");
const { query } = require("../../middleware/query");
const { getAll, create, update, byID } = require("../../controllers/role");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/role:
 *  get:
 *    tags: [Role]
 *    summary: Get All Roles
 *    security:
 *      - bearer: []
 *    parameters:
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
 *        name: isActive
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(protect, query, getAll);

// Get Role API
/**
 * @swagger
 * /api/role/{id}:
 *  get:
 *    tags: [Role]
 *    summary: Get Role Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Role Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:role_id").get(protect, byID);

// Create API
/**
 * @swagger
 * /api/role:
 *  post:
 *    tags: [Role]
 *    summary: Create new Role
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Role'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(protect, create);

// Update API
/**
 * @swagger
 * /api/role/{id}:
 *  patch:
 *    tags: [Role]
 *    summary: Update Role
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Role Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/RoleUpdate'
 *
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:role_id").patch(protect, update);

module.exports = router;
