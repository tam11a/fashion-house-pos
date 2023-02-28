// Get All API
/**
 * @swagger
 * /api/supplier:
 *  get:
 *    tags: [Supplier]
 *    summary: Get All Suppliers
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

// Get Supplier API
/**
 * @swagger
 * /api/supplier/{id}:
 *  get:
 *    tags: [Supplier]
 *    summary: Get Supplier Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Supplier Id
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
 * /api/supplier:
 *  post:
 *    tags: [Supplier]
 *    summary: Create new Supplier
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Supplier'
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
 * /api/supplier/{id}:
 *  patch:
 *    tags: [Supplier]
 *    summary: Update Supplier
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Supplier Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/SupplierUpdate'
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
