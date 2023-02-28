// Get All API
/**
 * @swagger
 * /api/customer:
 *  get:
 *    tags: [Customer]
 *    summary: Get All Customers
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

// Get Customer API
/**
 * @swagger
 * /api/customer/{id}:
 *  get:
 *    tags: [Customer]
 *    summary: Get Customer Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Customer Id
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
 * /api/customer:
 *  post:
 *    tags: [Customer]
 *    summary: Create new Customer
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Customer'
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
 * /api/customer/{id}:
 *  patch:
 *    tags: [Customer]
 *    summary: Update Customer
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Customer Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/CustomerUpdate'
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
