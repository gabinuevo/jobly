/** Job class for Jobly */
const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
// Replace below with job helper queries.
// const { makeGetQuery, makeInsertQuery } = require("../helpers/companyQueryGens");
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
        // const queryInfo = makeInsertQuery(inputObj, safeFields);
        const result = await db.query(queryInfo.query, queryInfo.valuesArr);

        return result.rows[0];
    }

}

module.exports = Job;