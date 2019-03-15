/** Job class for Jobly */
const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const { makeGetQuery, makeInsertQuery } = require("../helpers/jobQueryGens");
const { BAD_REQUEST } = require("../config");


/** A job on the site */

class Job {

    static getSafeFields(){
        const safeFields = ["id", "title", "salary",
        "equity", "company_handle", "date_posted"];
        return safeFields;
    }

      /** Insert a new job into the database -- returns
     * {handle, name, num_employees, descrption, logo_url} */
    static async addJob(inputObj) {
        const safeFields = Job.getSafeFields();
        const queryInfo = makeInsertQuery(inputObj, safeFields);
        const result = await db.query(queryInfo.query, queryInfo.valuesArr);

        return result.rows[0];
    }

    /** Get a list of jobs 
     * NOTE: MUST TAKE OBJECT
     * -- returns
     * [{handle, name}, ...]
     */

    static async searchByTerms(queryObj) {
        const safeFields = this.getSafeFields();

        const queryInfo = makeGetQuery(queryObj, safeFields);
        const result = await db.query(queryInfo.query,
            queryInfo.searchParams);

        return result.rows;
    }

}

module.exports = Job;