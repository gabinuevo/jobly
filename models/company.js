/** Company class for Jobly */
const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const { makeGetQuery, makeInsertQuery } = require("../helpers/companyQueryGens");
const { BAD_REQUEST } = require("../config");

/** A company on the site */

class Company {

    static safeFields = ["handle", "name", "num_employees",
                         "description", "logo_url"];

    /** Get a list of companies -- returns
     * [{handle, name}, ...]
     */

    static async getAll(queryObj) {
        const queryInfo = makeGetQuery(queryObj, safeFields);
        const result = await db.query(queryInfo.query,
            queryInfo.searchParams);

        return result.rows;
    }
    
    /** Insert a new company into the database -- returns
     * {handle, name, num_employees, descrption, logo_url} */
    static async addCompany(inputObj) {
        try {
            const queryInfo = makeInsertQuery(inputObj, safeFields);
            const result = await db.query(queryInfo.query, queryInfo.valuesArr);

            return result.rows[0];
        } catch (err) {
            throw {status: BAD_REQUEST, message: 'Company handle already taken'}
        }
    }

    /** Get all company data using company handle. Returns company
     * object or company not found error. */
    static async getOneCompany(handle) {
        const result = await db.query(
            `SELECT handle, name, num_employees, description, logo_url 
            FROM companies WHERE handle=$1`,
            [handle]);

        return result.rows[0];
    }

    /** Takes in viariable information on a company selected via handle,
     * changes appropriate fields, returns company object with
     * company data. */
    static async updateOneCompany(table, items, key, id) {

        const queryInfo = sqlForPartialUpdate(table, items, key, id, safeFields);

        const result = await db.query(queryInfo.query, queryInfo.values);

        return result.rows[0];
    }

    /** Takes in company handle, deletes company if in database. 
     * Returns SQL DELETE object. */
    static async deleteOneCompany(handle) {

        const result = await db.query(
            `DELETE FROM companies
            WHERE handle=$1`,
            [handle]);

        return result;
    }

}

module.exports = Company;