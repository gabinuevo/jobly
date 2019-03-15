const Router = require("express").Router;
const Job = require("../models/job");
const ExpressError = require("../helpers/expressError");
const { BAD_REQUEST, NOT_FOUND } = require("../config");
const { validate } = require("jsonschema");
// const companySchemaNew = require("../schemas/companySchemaNew.json");

// TODO: ADD SCHEMA

const router = new Router();

/** Post a new job, return error if data is invalid. */
router.post("/", async function (req, res, next) {
    try {
        // const validation = validate(req.body, companySchemaNew);
        // if (!validation.valid) {
        //     const errors = validation.errors.map(e => e.stack);
        //     throw new ExpressError (errors, BAD_REQUEST);
        // }
        const job = await Job.addJob(req.body);

        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;