const Router = require("express").Router;
const Job = require("../models/job");
const ExpressError = require("../helpers/expressError");
const { BAD_REQUEST, NOT_FOUND } = require("../config");
const { validate } = require("jsonschema");
const jobSchemaNew = require("../schemas/jobSchemaNew.json");

// TODO: ADD SCHEMA

const router = new Router();

/** Post a new job, return error if data is invalid. */
router.post("/", async function (req, res, next) {
    try {
        const validation = validate(req.body, jobSchemaNew);

        if (!validation.valid) {
            const errors = validation.errors.map(e => e.stack);
            throw new ExpressError (errors, BAD_REQUEST);
        }
        const job = await Job.addJob(req.body);

        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});

/** GET /  - get full list of companies or
* list of companies matching passed in parameters.
* => {companies [{name, handle}, ...]}
*/
router.get("/", async function (req, res, next) {
    try {
        const { search, min_salary, min_equity } = req.body;

        const result = await Job.searchByTerms({ search, min_salary, min_equity });
        return res.json({jobs: result});
        
    } catch (err) {
        return next(err);
    }
});

module.exports = router;