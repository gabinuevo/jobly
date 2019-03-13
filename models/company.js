/** Company class for Jobly */
const db = require("../db");

const makeQuery = require('../helpers/queryMakers')

/** A company on the site */

class Company {

    /** Get a list of companies -- returns
     * [{handle, name}, ...]
     */

    static async getAll(queryObj) {
        let queryInfo = makeQuery(queryObj)
        const result = await db.query(queryInfo.query,
            queryInfo.searchParams);

        return result.rows;
    }
}

module.exports = Company;