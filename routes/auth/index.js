const express = require("express");
const {
	login,
	validate,
	updateProfile,
	forgetpassword,
	resetpassword,
} = require("../../controllers/auth");
const { protect } = require("../../middleware/auth");
const router = express.Router();

// Login API
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    tags: [Authentication]
 *    summary: Login Employee Account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *                default: ibrahimsadiktamim@gmail.com
 *              password:
 *                type: string
 *                default: 123456
 *
 *    responses:
 *      200:
 *        description: Login successful
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Invalid Credentials
 *
 */
router.route("/login").post(login);

// Validation API
/**
 * @swagger
 * /api/auth/validate:
 *  get:
 *    tags: [Authentication]
 *    summary: Validate Employee Account
 *    security:
 *      - bearer: []
 *    responses:
 *      200:
 *        description: Authorized
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: No User Found
 *
 */
router.route("/validate").get(protect, validate);

// Update API
/**
 * @swagger
 * /api/auth/update:
 *  patch:
 *    tags: [Authentication]
 *    summary: Update Personal Account
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AdminUpdate'
 *
 *    responses:
 *      201:
 *        description: Account information updated
 *      400:
 *        description: Bad Request
 *
 */
router.route("/update").patch(protect, updateProfile);

// Send OTP API
/**
 * @swagger
 * /api/auth/forgot-password:
 *  post:
 *    tags: [Authentication]
 *    summary: Forgot Employee Password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *                default: ibrahimsadiktamim@gmail.com
 *
 *    responses:
 *      200:
 *        description: OTP Sent
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Invalid Credentials
 *
 */
router.route("/forgot-password").post(forgetpassword);

// Reset Password API
/**
 * @swagger
 * /api/auth/reset-password:
 *  post:
 *    tags: [Authentication]
 *    summary: Reset Employee Password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - token
 *              - otp
 *              - password
 *            properties:
 *              token:
 *                type: string
 *              otp:
 *                type: string
 *              password:
 *                type: string
 *
 *    responses:
 *      204:
 *        description: Reset done
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Invalid Credentials
 *
 */
router.route("/reset-password").post(resetpassword);

module.exports = router;
