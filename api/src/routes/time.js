const express = require('express');

const { timeController } = require('../controllers/timeController');
const { timeValidator } = require('../validators/timeValidator');
const authMiddleware = require('../middleware/authMiddleware');
const appConstants = require('../constants/app');

const { SUPERADMIN, ADMIN, USER } = appConstants.user.roles;
const router = express.Router();

/**
 * @api {get} /time List time entries
 * @apiName TimeList
 * @apiGroup Time
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Query) {String="YYYY-MM-DD"} [from] Filter list by date, from this date (including) onward
 * @apiParam (Query) {String="YYYY-MM-DD"} [to] Filter list by date, to this date
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "Time list fetched.",
 *         "data": [
 *             {
 *                 "id": 1,
 *                 "date": "2019-10-14",
 *                 "length": 5,
 *                 "note": "Some note",
 *                 "userId": 2,
 *                 "createdAt": "2019-10-14T21:26:44.000Z",
 *                 "updatedAt": "2019-10-14T21:26:44.000Z",
 *                 "user": {
 *                     "id": 2,
 *                     "firstName": "Aleksandar",
 *                     "lastName": "Tosic",
 *                     "email": "tosha90@gmail.com",
 *                     "role": "3",
 *                     "preferredWorkingHours": 4,
 *                     "createdAt": "2019-10-14T20:12:25.000Z",
 *                     "updatedAt": "2019-10-14T20:44:30.000Z"
 *                 }
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
    authMiddleware.authorize([SUPERADMIN, ADMIN]),
    timeValidator.validateList(),
    (req, res, next) => timeController.doAction('list', req, res, next)
);

/**
 * @api {get} /time/export Export time entries
 * @apiDescription Export filtered time entries to PDF
 * @apiName TimeListExport
 * @apiGroup Time
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Query) {String="YYYY-MM-DD"} [from] Filter list by date, from this date (including) onward
 * @apiParam (Query) {String="YYYY-MM-DD"} [to] Filter list by date, to this date
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *         "msg": "Time list PDF generated.",
 *         "data": {
 *             "file": "data:application/pdf;base64,...",
 *             "name": "toptal_time_management_time_export_20191016011957.pdf"
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
    authMiddleware.authorize([SUPERADMIN, ADMIN]),
    timeValidator.validateList(),
    (req, res, next) => timeController.doAction('export', req, res, next)
);

/**
 * @api {get} /time/me List my time entries
 * @apiDescription Get the list of the currently logged in user's time entries
 * @apiName TimeListMe
 * @apiGroup Time
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Query) {String="YYYY-MM-DD"} [from] Filter list by date, from this date (including) onward
 * @apiParam (Query) {String="YYYY-MM-DD"} [to] Filter list by date, to this date
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "Time list fetched.",
 *         "data": [
 *             {
 *                 "id": 1,
 *                 "date": "2019-10-14",
 *                 "length": 5,
 *                 "note": "Some note",
 *                 "userId": 2,
 *                 "createdAt": "2019-10-14T21:26:44.000Z",
 *                 "updatedAt": "2019-10-14T21:26:44.000Z",
 *                 "user": {
 *                     "id": 2,
 *                     "firstName": "Aleksandar",
 *                     "lastName": "Tosic",
 *                     "email": "tosha90@gmail.com",
 *                     "role": "3",
 *                     "preferredWorkingHours": 4,
 *                     "createdAt": "2019-10-14T20:12:25.000Z",
 *                     "updatedAt": "2019-10-14T20:44:30.000Z"
 *                 }
 *             }
 *         ]
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
    '/me',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER]),
    timeValidator.validateList(),
    (req, res, next) => timeController.doAction('listPerUser', req, res, next),
);

/**
 * @api {get} /time/me/export Export my time entries
 * @apiDescription Export the list of the currently logged in user's time entries to PDF
 * @apiName TimeListMeExport
 * @apiGroup Time
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Query) {String="YYYY-MM-DD"} [from] Filter list by date, from this date (including) onward
 * @apiParam (Query) {String="YYYY-MM-DD"} [to] Filter list by date, to this date
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *         "msg": "Time list PDF generated.",
 *         "data": {
 *             "file": "data:application/pdf;base64,...",
 *             "name": "toptal_time_management_time_export_20191016011957.pdf"
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
    '/me/export',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER]),
    timeValidator.validateList(),
    (req, res, next) => timeController.doAction('exportPerUser', req, res, next)
);

/**
 * @api {get} /time/:id Time entry details
 * @apiDescription Get a single time entry
 * @apiName TimeDetails
 * @apiGroup Time
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Params) {Number} id The id of the time entry to fetch
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "Time entry found.",
 *         "data": {
 *             "id": 1,
 *             "date": "2019-10-14",
 *             "length": 5,
 *             "note": "Some note",
 *             "userId": 2,
 *             "createdAt": "2019-10-14T21:26:44.000Z",
 *             "updatedAt": "2019-10-14T21:26:44.000Z"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "errors": [
 *             {
 *                 "msg": "Time entry not found."
 *             }
 *         ]
 *     }
 */
router.get(
    '/:id',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER]),
    authMiddleware.authorizeTimeAccess(),
    (req, res, next) => timeController.doAction('details', req, res, next)
);

/**
 * @api {post} /time Create a time entry
 * @apiDescription Create a new time entry
 * @apiName TimeCreate
 * @apiGroup Time
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Body) {String="YYYY-MM-DD"} date The date for which you wanna add a time entry
 * @apiParam (Body) {Number} length The length of the time entry
 * @apiParam (Body) {String} [note] A note you want to add to the time entry
 * @apiParam (Body) {Number} [userId] Superadmin and admins can pass this to assign a time entry to another user
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *         "msg": "Time entry created.",
 *         "data": {
 *             "id": 1,
 *             "date": "2019-10-14",
 *             "length": 5,
 *             "note": "Some note",
 *             "userId": 2,
 *             "updatedAt": "2019-10-14T21:26:44.903Z",
 *             "createdAt": "2019-10-14T21:26:44.903Z"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *         "errors": [
 *             {
 *                 "msg": "Date is required.",
 *                 "param": "date",
 *                 "location": "body"
 *             }
 *         ]
 *     }
 */
router.post(
    '/',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER]),
    authMiddleware.authorizeTimeAccess(),
    timeValidator.validateCreate(),
    (req, res, next) => timeController.doAction('create', req, res, next)
);

/**
 * @api {patch} /time/:id Update a time entry
 * @apiDescription Update an existing time entry
 * @apiName TimeUpdate
 * @apiGroup Time
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Params) {Number} id The id of the time entry to update
 * @apiParam (Body) {String="YYYY-MM-DD"} [date] The date for which you wanna set the time entry
 * @apiParam (Body) {Number} [length] The length of the time entry
 * @apiParam (Body) {String} [note] A note you want to add to the time entry
 * @apiParam (Body) {Number} [userId] Superadmin and admins can pass this to assign a time entry to another user
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "Time entry updated.",
 *         "data": {
 *             "id": 1,
 *             "date": "2019-10-14",
 *             "length": 5,
 *             "note": "Some updated note",
 *             "userId": 2,
 *             "createdAt": "2019-10-14T21:26:44.000Z",
 *             "updatedAt": "2019-10-14T21:37:19.000Z"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "errors": [
 *             {
 *                 "msg": "Time entry not found."
 *             }
 *         ]
 *     }
 */
router.patch(
    '/:id',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER]),
    authMiddleware.authorizeTimeAccess(),
    timeValidator.validateUpdate(),
    (req, res, next) => timeController.doAction('update', req, res, next)
);

/**
 * @api {delete} /time/:id Delete a time entry
 * @apiDescription Delete an existing time entry
 * @apiName TimeDelete
 * @apiGroup Time
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Params) {Number} id The id of the time entry to delete
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "Time entry deleted.",
 *         "data": {
 *             "id": 1
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "errors": [
 *             {
 *                 "msg": "Time entry not found."
 *             }
 *         ]
 *     }
 */
router.delete(
    '/:id',
    authMiddleware.authorize([SUPERADMIN, ADMIN, USER]),
    authMiddleware.authorizeTimeAccess(),
    timeValidator.validateDelete(),
    (req, res, next) => timeController.doAction('delete', req, res, next)
);

module.exports = router;
