// Get All API
/**
 * @swagger
 * /api/branch:
 *  get:
 *    tags: [Branch]
 *    summary: Get All Branches
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

// Get Branch API
/**
 * @swagger
 * /api/branch/{id}:
 *  get:
 *    tags: [Branch]
 *    summary: Get Branch Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Branch Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

// Create API
/**
 * @swagger
 * /api/branch:
 *  post:
 *    tags: [Branch]
 *    summary: Create new Branch
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Branch'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */

// Update API
/**
 * @swagger
 * /api/branch/{id}:
 *  patch:
 *    tags: [Branch]
 *    summary: Update Branch
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Branch Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/BranchUpdate'
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
