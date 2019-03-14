/** Company class for Jobly */
const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const { makeGetQuery, makeInsertQuery } = require("../helpers/queryMakers");

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

        return result.rows[0];
    }

    static async getOneCompany(handle) {
        const result = await db.query(
            `SELECT handle, name, num_employees, description, logo_url 
            FROM companies WHERE handle ILIKE $1`,
            [handle]);

        return result.rows[0];
    }

    static async updateOneCompany(table, items, key, id) {

        const queryInfo = sqlForPartialUpdate(table, items, key, id);

        const result = await db.query(queryInfo.query, queryInfo.values);

        return result.rows[0];
    }

}

module.exports = Company;