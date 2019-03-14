const Router = require("express").Router;
const { Company } = require("../models/company");
const ExpressError = require("../helpers/expressError");
const { BAD_REQUEST, NOT_FOUND } = require("../config");
const { validate } = require("jsonschema");
const companySchemaNew = require("../schemas/companySchemaNew.json");
const companySchemaPatch = require("../schemas/companySchemaPatch.json");

const router = new Router();

/** GET /  - get full list of companies or
* list of companies matching passed in parameters.
* => {companies [{name, handle}, ...]}
*/
router.get("/", async function (req, res, next) {
    try {
        const { search, min_employees, max_employees } = req.body;
        // note: if one is missing, this if statement will not run
        if (min_employees > max_employees){
            throw new ExpressError ("Max employees should not be less than Min employees.", BAD_REQUEST);
        }
        const result = await Company.getAll({ search, min_employees, max_employees });
        return res.json({companies: result});
    } catch (err) {
        return next(err);
    }
});

/** Post a new company, return error if data is invalid. */
router.post("/", async function (req, res, next) {
    try {
        const validation = validate(req.body, companySchemaNew);
        if (!validation.valid) {
            const errors = validation.errors.map(e => e.stack);
            throw new ExpressError (errors, BAD_REQUEST);
        }
        const company = await Company.addCompany(req.body);

        return res.status(201).json({ company });
    } catch (err) {
        return next(err);
    }
});

/** get data on one company, return NOT_FOUND error if company not in database */
router.get("/:handle", async function (req, res, next){
    try {
        const handle = req.params.handle;

        const company = await Company.getOneCompany(handle);

        if (!company) {
            throw new ExpressError ("Company not found", NOT_FOUND);
        }

        return res.json({ company })

    } catch(err) {
        return next(err);
    }
});

/** patch route to update one company.
 * returns error if company does not exist.
 * otherwise returns all up to date info on company.
 */
router.patch("/:handle", async function (req, res, next){
    try {
        const validation = validate(req.body, companySchemaPatch);
        if (!validation.valid) {
            const errors = validation.errors.map(e => e.stack);
            throw new ExpressError (errors, BAD_REQUEST);
        }

        const handle = req.params.handle;

        const updatedCompany = await Company.updateOneCompany('companies', req.body, 'handle', handle);

        if (!updatedCompany) {
            return next({
                status: NOT_FOUND,
                message: "Company not found"
            });
        }

        return res.json({ company: updatedCompany })

    } catch(err) {
        return next(err);
    }
});

/** Delete company via company handle. Returns --
 * { message: "Company deleted." } */
router.delete("/:handle", async function (req, res, next){
    try {
        const result = await Company.deleteOneCompany(req.params.handle);

        if (!result.rowCount) {
            throw new ExpressError ("Company not found", NOT_FOUND);
        }

        return res.json({ message: "Company deleted." })
    } catch (err) {
        return next(err);
    }
});

module.exports = router;