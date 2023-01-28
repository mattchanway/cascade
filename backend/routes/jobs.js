const express = require("express");
const router = express.Router();
const JobsManager = require("../models/JobsManager");


// GET / get all jobs

router.get("/", async function (req, res, next) {

    try {
        if(!req.cookies.sessionId) return res.json({noUser:'No User'});
        let result = await JobsManager.getAllJobs();
        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.get("/:id", async function (req, res, next) {

    try {
        
        let id = req.params.id;

        let result = await JobsManager.getJob(id);

        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.post("/", async function (req, res, next) {

    try {
       
        let result = await JobsManager.addJob(req.body);
        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.put("/:id", async function (req, res, next) {

    try {
        let id = req.params.id;
        let result = await JobsManager.editJob(req.body, id);

        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.patch("/:id", async function (req, res, next) {

    try {
        
        let id = req.params.id;
        let result = await JobsManager.deactivateJob(id);

        return res.json(result);
    }
    catch (err) {

        return next(err);
    }
});

router.delete("/:id", async function (req, res, next) {

    try {
        let id = req.params.id;
        await JobsManager.deleteEmployee(id);

        return res.json({ message: "job deleted" });
    }
    catch (err) {

        return next(err);
    }
});

module.exports = router;