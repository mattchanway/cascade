

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const EmployeeManager = require("../models/EmployeeManager");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

async function authenticateJWT(req, res, next) {
    try {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {

            const sessionTokenPayload = jwt.verify(sessionId, SECRET_KEY);
            // console.log("sessiontokenpayload",sessionTokenPayload)
            if (Date.now() >= sessionTokenPayload.exp) {
                console.log('gotcha')
                return next();
            }

            const dbFetch = await EmployeeManager.getJwt(sessionId);
            console.log("DBFETCH", dbFetch)
            const dbTokenPayload = jwt.verify(dbFetch, SECRET_KEY);
            console.log(Date.now(), dbTokenPayload.exp);
            console.log("DBTOKEN", dbTokenPayload)

            if (Date.now() >= dbTokenPayload.exp) {
                // ***need to rotate the JWT token here**
                console.log('ROTATING TOKEN')
                const { jwtToken, session } = await EmployeeManager.createNewTokens(sessionTokenPayload.employee_id, sessionTokenPayload.position);
                res.locals.user = jwt.verify(jwtToken, SECRET_KEY);
                return next();
            }


            res.locals.user = dbTokenPayload;
            console.log("NO ROTATION")
            return next();
        }
        return next();
    } catch (err) {
        console.log(err)
        return next();
    }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new Error("Unauthorized");
        console.log("ENSURELOGGEDIN", res.locals.user)
        return next();
    } catch (err) {
        return next(err);
    }
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureManager(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.position !== 3) {
            console.log('ENSURE MANAGER')
            throw new Error("Unauthorized");
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

function ensureCorrectUserOrManager(req, res, next) {
    try {
        const user = res.locals.user;
        if ((!user.isAdmin && !user.employee_id === req.params.id)) {
            throw new Error("Unauthorized, must be manager or same user");
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureManager,
    ensureCorrectUserOrManager
};