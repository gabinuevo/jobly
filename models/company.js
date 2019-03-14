/** Company class for Jobly */
const db = require("../db");

const { makeGetQuery, makeInsertQuery } = require('../helpers/queryMakers')

/** A company on the site */

class Company {

    /** Get a list of companies -- returns
     * [{handle, name}, ...]
     */

    static async getAll(queryObj) {
        const queryInfo = makeGetQuery(queryObj);
        const result = await db.query(queryInfo.query,
            queryInfo.searchParams);

        return result.rows;
    }
    
    /** Insert a new company into the database -- returns
     * {handle, name, num_employees, descrption, logo_url}
     */
    static async addCompany(inputObj) {
        const queryInfo = makeInsertQuery(inputObj);
        const result = await db.query(queryInfo.query, queryInfo.valuesArr);
        debugger;
        return result.rows[0];
    }

}

module.exports = Company;