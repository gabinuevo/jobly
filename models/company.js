/** Company class for Jobly */
const db = require("../db");

/** A company on the site */

class Company {

    /** Get a list of companies -- returns
     * [{handle, name}, ...]
     */

     static async getAll({ search='%', min_employees=0, max_employees=Infinity }) {
        const result = await db.query(
            `SELECT
             handle,
             name,
             FROM companies
             WHERE num_employees>$1 AND num_employees<$2
             AND name
             LIKE '$3' `,
             [min_employees, max_employees, search]
        );
        return result.rows;
     } 

}ˀ

module.exports = Company;