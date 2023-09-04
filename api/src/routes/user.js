const express = require('express');

const { userController } = require('../controllers/userController');
const { userValidator } = require('../validators/userValidator');
const authMiddleware = require('../middleware/authMiddleware');
const appConstants = require('../constants/app');

const { SUPERADMIN, ADMIN, USER_MANAGER } = appConstants.user.roles;
const router = express.Router();

/**
 * @api {get} /user List users
 * @apiName UserList
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Query) {Number} [page] For pagination - which page to fetch
 * @apiParam (Query) {Number} [pageSize] For pagination - how many items per page to fetch
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "User list fetched.",
 *         "data": [
 *             {
 *                 "id": 2,
 *                 "firstName": "Aleksandar",
 *                 "lastName": "Tosic",
 *                 "email": "tosha90@gmail.com",
 *                 "role": "3",
 *                 "preferredWorkingHours": 4,
 *                 "createdAt": "2019-10-14T20:12:25.000Z",
 *                 "updatedAt": "2019-10-14T20:44:30.000Z"
 *             }
 *         ]
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *         "errors": [
 *             {
 *                 "msg": "You are not allowed to access this resource."
 *             }
 *         ]
 *     }
 */
router.get(
    '/',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER_MANAGER]),
    userValidator.validateList(),
    (req, res, next) => userController.doAction('list', req, res, next)
);

/**
 * @api {get} /user/export Export users
 * @apiDescription Export the filtered list of users to PDF
 * @apiName UserListExport
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Query) {Number} [page] For pagination - which page to fetch
 * @apiParam (Query) {Number} [pageSize] For pagination - how many items per page to fetch
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *         "msg": "User list PDF generated.",
 *         "data": {
 *             "file": "data:application/pdf;base64,...",
 *             "name": "toptal_time_management_user_export_20191016011957.pdf"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *         "errors": [
 *             {
 *                 "msg": "Token invalid or expired."
 *             }
 *         ]
 *     }
 */
router.get(
    '/export',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER_MANAGER]),
    (req, res, next) => userController.doAction('export', req, res, next)
);

/**
 * @api {get} /user/:id User details
 * @apiDescription Get a single user
 * @apiName UserDetails
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Params) {Number} id The id of the user to fetch
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "User found.",
 *         "data": {
 *             "id": 2,
 *             "firstName": "Aleksandar",
 *             "lastName": "Tosic",
 *             "email": "tosha90@gmail.com",
 *             "role": "3",
 *             "preferredWorkingHours": 4,
 *             "createdAt": "2019-10-14T20:12:25.000Z",
 *             "updatedAt": "2019-10-14T20:44:30.000Z"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "errors": [
 *             {
 *                 "msg": "User not found."
 *             }
 *         ]
 *     }
 */
router.get(
    '/:id',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER_MANAGER]),
    authMiddleware.authorizeUserAccess(),
    (req, res, next) => userController.doAction('details', req, res, next)
);

/**
 * @api {post} /user Create a user
 * @apiName UserCreate
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Body) {String} firstName The user's first name
 * @apiParam (Body) {String} lastName The user's last name
 * @apiParam (Body) {String} email The user's email
 * @apiParam (Body) {String} password The user's password
 * @apiParam (Body) {String} confirmPassword Password confirmation - should be the same value as "password"
 * @apiParam (Body) {String="1","2","3"} role The user's role
 * @apiParam (Body) {Number} [preferredWorkingHours] The minimum amount of hours user wants to work per day
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "User created.",
 *         "data": {
 *             "id": 2,
 *             "firstName": "Aleksandar",
 *             "lastName": "Tosic",
 *             "email": "tosha90@gmail.com",
 *             "role": "3",
 *             "preferredWorkingHours": 4,
 *             "createdAt": "2019-10-14T20:12:25.000Z",
 *             "updatedAt": "2019-10-14T20:44:30.000Z"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *         "errors": [
 *             {
 *                 "msg": "First name is required.",
 *                 "param": "firstName",
 *                 "location": "body"
 *             },
 *             {
 *                 "msg": "First name should be a string.",
 *                 "param": "firstName",
 *                 "location": "body"
 *             }
 *         ]
 *     }
 */
router.post(
    '/',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER_MANAGER]),
    authMiddleware.authorizeUserAccess(),
    userValidator.validateCreate(),
    (req, res, next) => userController.doAction('create', req, res, next)
);

/**
 * @api {patch} /user/:id Update user's info
 * @apiName UserUpdate
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Params) {Number} id The id of the user to update
 * @apiParam (Body) {String} [firstName] The user's first name
 * @apiParam (Body) {String} [lastName] The user's last name
 * @apiParam (Body) {String} [email] The user's email
 * @apiParam (Body) {String="1","2","3"} [role] The user's role
 * @apiParam (Body) {Number} [preferredWorkingHours] The minimum amount of hours user wants to work per day
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "User updated.",
 *         "data": {
 *             "id": 2,
 *             "firstName": "Aleksandar",
 *             "lastName": "Tosic",
 *             "email": "tosha90@gmail.com",
 *             "role": "3",
 *             "preferredWorkingHours": 5,
 *             "createdAt": "2019-10-14T20:12:25.000Z",
 *             "updatedAt": "2019-10-14T22:45:54.000Z"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "errors": [
 *             {
 *                 "msg": "User not found."
 *             }
 *         ]
 *     }
 */
router.patch(
    '/:id',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER_MANAGER]),
    authMiddleware.authorizeUserAccess(),
    userValidator.validateUpdate(),
    (req, res, next) => userController.doAction('update', req, res, next)
);

/**
 * @api {patch} /user/:id/password Update user's password
 * @apiName UserUpdatePassword
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Params) {Number} id The id of the user to update
 * @apiParam (Body) {String} password The user's new password
 * @apiParam (Body) {String} confirmPassword Password confirmation - should be the same value as "password"
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "User updated.",
 *         "data": {
 *             "id": 2,
 *             "firstName": "Aleksandar",
 *             "lastName": "Tosic",
 *             "email": "tosha90@gmail.com",
 *             "role": "3",
 *             "preferredWorkingHours": 5,
 *             "createdAt": "2019-10-14T20:12:25.000Z",
 *             "updatedAt": "2019-10-14T22:45:54.000Z"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "errors": [
 *             {
 *                 "msg": "User not found."
 *             }
 *         ]
 *     }
 */
router.patch(
    '/:id/password',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER_MANAGER]),
    authMiddleware.authorizeUserAccess(),
    userValidator.validateUpdatePassword(),
    (req, res, next) => userController.doAction('updatePassword', req, res, next)
)

/**
 * @api {delete} /user/:id Delete a user
 * @apiName UserDelete
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Params) {Number} id The id of the user to delete
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "User deleted.",
 *         "data": {
 *             "id": "6"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "errors": [
 *             {
 *                 "msg": "User not found."
 *             }
 *         ]
 *     }
 */
router.delete(
    '/:id',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER_MANAGER]),
    authMiddleware.authorizeUserAccess(),
    userValidator.validateDelete(),
    (req, res, next) => userController.doAction('delete', req, res, next)
);

module.exports = router;
