const express = require("express");
const router = express.Router();
const { authenticateJWT, ensureLoggedIn, ensureCorrectUserOrManager } = require("../middleware/middlewareAuth");
const EmployeeManager = require("../models/EmployeeManager");


// GET / get all employees

router.get("/", async function (req, res, next) {

    try {
        let result = await EmployeeManager.getAllEmployees();
        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.get("/params", async function (req, res, next) {

    try {
        let result = await EmployeeManager.getPositionsAndCertifications();
        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.get("/:id", authenticateJWT, ensureLoggedIn, ensureCorrectUserOrManager, async function (req, res, next) {

    try {
        let id = req.params.id;

        let result = await EmployeeManager.getEmployee(id);
       
        return res.json(result);
        
    }
    catch (err) {

        return next(err);
    }
});

router.post("/", async function (req, res, next) {

    try {
        console.log(req.body)
        let data = {...req.body, temp_password: 'password'}
        let result = await EmployeeManager.addEmployee(data);
        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.put("/:id", async function (req, res, next) {

    try {
        let id = req.params.id;
        let result = await EmployeeManager.editEmployee(req.body, id);

        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.patch("/:id", async function (req, res, next) {

    try {
        let password = req.body.password;
        let id = req.params.id;
        let result = await EmployeeManager.updatePassword(password, id);

        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.delete("/:id", async function (req, res, next) {

    try {
        let id = req.params.id;
        await EmployeeManager.deleteEmployee(id);

        return res.json({ message: "employee deleted" });
    }
    catch (err) {

        return next(err);
    }
});

module.exports = router;