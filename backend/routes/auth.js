const express = require("express");
const router = express.Router();
const EmployeeManager = require("../models/EmployeeManager");
const jwt = require("jsonwebtoken");
const { authenticateJWT, ensureLoggedIn } = require("../middleware/middlewareAuth");
const { SECRET_KEY } = require("../config");
const { encrypt, decrypt } = require('../encryption');


// POST / LOGIN

router.post("/", async function (req, res, next) {

    try {
        // JWT and SESSION are stored in database, session is sent to HTTP ONLY COOKIE
        // on every API request, the database must check the JWT
        // the whoAmI API route can check the session, if it's not expired, say 1 hour, browsing can continue
        const { id, password } = req.body;
        let result = await EmployeeManager.authenticate(id, password);

        if (result !== false) {
            res.cookie('sessionId', result.session_id, { maxAge: ((1000 * 60) * 420) });


        }
        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

// POST / LOGOUT

router.post("/logout", async function (req, res, next) {

    try {
        // JWT and SESSION are stored in database, session is sent to HTTP ONLY COOKIE
        // on every API request, the database must check the JWT
        // the whoAmI API route can check the session, if it's not expired, say 1 hour, browsing can continue
        res.clearCookie("sessionId");
        return res.end();
    }
    catch (err) {

        return next(err);
    }
});

router.post("/password-update/:id", authenticateJWT, ensureLoggedIn, async function (req, res, next) {

    try {
        const user = res.locals.user;
        let employee_id = user.employee_id;
        let position = user.position;

        let passwordToken = await EmployeeManager.createPasswordToken(employee_id, position);
        return res.json(passwordToken);
    }
    catch (e) {
        return next(e);
    }


})

// Create a password token for a user ID
router.get("/password-token/:id", async function (req, res, next) {

    try {
        const id = req.params.id;
        let passwordToken = await EmployeeManager.createPasswordToken(id);
        return res.json(passwordToken);

    }

    catch (e) {

        return next(e);
    }


})

// Use the token to update a forgotten password

router.post("/password-forgotten-update/:token", async function (req, res, next) {

    try {
        let token = req.params.token;

        let { password } = req.body;

        let result = await EmployeeManager.updateForgottenPassword(token, password);
        res.cookie('sessionId', result.session, { maxAge: 99999999999 * 600 });
        return res.json(result.user);

    }
    catch (e) {

        return next(e);
    }
})




router.get("/whoami", async function (req, res, next) {

    try {
    
        if (req.cookies.sessionId) {
           console.log('HHHHHHHHHHHHHHHHHHHHI')
            let sessionId = req.cookies.sessionId;
            let encrypted = encrypt(sessionId);
            console.log('ENCRYPTED', encrypted);
            let decrypted = decrypt(encrypted)
            console.log('DECRYPTED', decrypted, 'OG SESSION ID', sessionId)
            const { exp } = jwt.decode(sessionId);
           
            if (Date.now() >= exp * 1000) {
                console.log('date catch')
                return res.json({ noUser: "unable to auth" });
            }

            let userResult = await EmployeeManager.whoAmI(sessionId);
           
            return res.json(userResult);
        }
        return res.json({ noUser: "unable to auth" });
    }
    catch (err) {

        return next(err);
    }
});


module.exports = router;