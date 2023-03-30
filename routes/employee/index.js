const express = require("express");
const { protect } = require("../../middleware/auth");
const {
	register,
	getAll,
	byID,
	activeInactive,
	update,
} = require("../../controllers/employee");
const { query } = require("../../middleware/query");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/employee:
 *  get:
 *    tags: [Employee]
 *    summary: Get All Employees
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
 *        name: isVerified
 *        type: string
 *      - in: query
 *        name: isActive
 *        type: string
 *      - in: query
 *        name: gender
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(protect, query, getAll);

// Get Employee API
/**
 * @swagger
 * /api/employee/{id}:
 *  get:
 *    tags: [Employee]
 *    summary: Get Employee Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Employee Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:employee_id").get(protect, byID);

// Register API
/**
 * @swagger
 * /api/employee/register:
 *  post:
 *    tags: [Employee]
 *    summary: Register New Employee
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Admin'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/register").post(protect, register);

// Update Status API
/**
 * @swagger
 * /api/employee/{id}:
 *  put:
 *    tags: [Employee]
 *    summary: Toggle Employee Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Employee Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:employee_id").put(protect, activeInactive);

// Update API
/**
 * @swagger
 * /api/employee/{id}:
 *  patch:
 *    tags: [Employee]
 *    summary: Update Employee
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Employee Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/AdminUpdate'
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
router.route("/:employee_id").patch(protect, update);

module.exports = router;
