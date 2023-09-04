const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { accountController } = require('../controllers/accountController');
const { accountValidator } = require('../validators/accountValidator');

const router = express.Router();

/**
 * @api {post} /account/register Register
 * @apiDescription Register a new account
 * @apiName AccountRegister
 * @apiGroup Account
 * @apiVersion 0.1.0
 * 
 * @apiParam (Body) {String} firstName The user's first name
 * @apiParam (Body) {String} lastName The user's last name
 * @apiParam (Body) {String} email The user's email
 * @apiParam (Body) {String} password The user's password
 * @apiParam (Body) {String} confirmPassword Password confirmation - should be the same value as "password"
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *         "msg": "User registered successfully.",
 *         "data": {
 *             "token": "eyJhbGciOiJIUzCI6IkpXVCJ9.eyJpZCI6MiwTcxMDgzOTQ1fQ.KGY1uTR96GvzRjKSeMsPR6LERa9adb-k"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Response
 *     {
 *         "errors": [
 *             {
 *                 "msg": "A user with that email address already exists."
 *             }
 *         ]
 *     }
 */
router.post(
    '/register',
    accountValidator.validateRegister(),
    (req, res, next) => accountController.doAction('register', req, res, next)
);

/**
 * @api {post} /account/login Login
 * @apiDescription Log in to the system
 * @apiName AccountLogin
 * @apiGroup Account
 * @apiVersion 0.1.0
 * 
 * @apiParam (Body) {String} email The user's email
 * @apiParam (Body) {String} password The user's password
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "User logged in successfully.",
 *         "data": {
 *             "token": "eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *         }
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *         "errors": [
 *             {
 *                 "msg": "Wrong email or password."
 *             }
 *         ]
 *     }
 */
router.post(
    '/login',
    accountValidator.validateLogin(),
    (req, res, next) => accountController.doAction('login', req, res, next)
);

/**
 * @api {get} /account/me Get my profile
 * @apiDescription Get the currently logged in player's profile
 * @apiName AccountGetProfile
 * @apiGroup Account
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "Profile fetched.",
 *         "data": {
 *             "id": 2,
 *             "firstName": "Aleksandar",
 *             "lastName": "Tosic",
 *             "email": "tosha90@gmail.com",
 *             "role": "3",
 *             "preferredWorkingHours": null,
 *             "createdAt": "2019-10-14T20:12:25.000Z",
 *             "updatedAt": "2019-10-14T20:12:25.000Z"
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
    '/me',
    authMiddleware.authenticate(),
    (req, res, next) => accountController.doAction('getProfile', req, res, next)
);

/**
 * @api {patch} /account/me Update my profile
 * @apiDescription Update the currently logged in player's profile
 * @apiName AccountUpdateProfile
 * @apiGroup Account
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Body) {String} [firstName] The user's first name
 * @apiParam (Body) {String} [lastName] The user's last name
 * @apiParam (Body) {String} [email] The user's email
 * @apiParam (Body) {Number} [preferredWorkingHours] The minimum amount of hours user wants to work per day
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "Profile updated.",
 *         "data": {
 *             "id": 2,
 *             "firstName": "Aleksandar",
 *             "lastName": "Tosic",
 *             "email": "tosha90@gmail.com",
 *             "role": "3",
 *             "preferredWorkingHours": 4,
 *             "createdAt": "2019-10-14T20:12:25.000Z",
 *             "updatedAt": "2019-10-14T20:31:10.000Z"
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
router.patch(
    '/me',
    authMiddleware.authenticate(),
    accountValidator.validateUpdateProfile(),
    (req, res, next) => accountController.doAction('updateProfile', req, res, next)
);

/**
 * @api {patch} /account/me/password Update my password
 * @apiDescription Update the currently logged in player's password
 * @apiName AccountUpdatePassword
 * @apiGroup Account
 * @apiVersion 0.1.0
 * 
 * @apiHeader {String} Authorization The authorization header with the user's token
 * @apiHeaderExample {json} Request-Example:
 *     {
 *         "Authorization": "Bearer eyJhbGciOiJIkpXVCJ9.eyJpZCI6MiwiaMjE1fQ.OP_u4MgBKy8CENbstU1H_aiHSnw"
 *     }
 * 
 * @apiParam (Body) {String} currentPassword The user's current password
 * @apiParam (Body) {String} password The user's new password
 * @apiParam (Body) {String} confirmPassword Password confirmation - should be the same value as "password"
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "msg": "Profile updated.",
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
 *                 "msg": "Confirm password is required.",
 *                 "param": "confirmPassword",
 *                 "location": "body"
 *             },
 *             {
 *                 "msg": "Confirm password should match the password.",
 *                 "param": "confirmPassword",
 *                 "location": "body"
 *             }
 *         ]
 *     }
 */
router.patch(
    '/me/password',
    authMiddleware.authenticate(),
    accountValidator.validateUpdatePassword(),
    (req, res, next) => accountController.doAction('updatePassword', req, res, next)
);

module.exports = router;
