/** Help functions to generate dynamic SQL queries
 * for jobs.
*/

/** Generates search query to search for job or jobs:
 * - All jobs search if no arguments entered.
 * - A job by title or partial title (in reference to the job title) if only search argument entered.
 * - jobs with min salary/equity requirements,
 *   if both are passed, both arguments are used.
 * - A job by title or partial title and salary/equity or both
 *   if search and some combination of salary/equity are used.
 * reqObj is an object of potential search parameters passed in
 * from "/jobs/" get route. It can equal any combination
 * of the following fields:
 * reqObj = { search, min_salary, min_equity }
 */
function makeGetQuery(reqObj) {
    let idx = 1;
    let whereStrMinMax = "";
    let searchStr = "";
    let searchParams = [];

    let query = `SELECT handle, name FROM companies `;

    if (!reqObj) {
        return query;
    }

    // Intentionally not letting searches for companies with 0 employees pass.
    if (reqObj["min_employees"]) {
        whereStrMinMax += `num_employees>$${idx} AND `;
        searchParams.push(reqObj["min_employees"]);
        idx += 1;
    }

    if (reqObj["max_employees"]) {
        whereStrMinMax += `num_employees<$${idx} AND `;
        searchParams.push(reqObj["max_employees"]);
        idx += 1;
    }

    if (reqObj["search"]) {
        searchStr += `name ILIKE $${idx}`;
        searchParams.push(`%${reqObj["search"]}%`);
        idx += 1;
    }    

    if (searchStr && !whereStrMinMax) {
        query += `WHERE ${searchStr}`;
    } else if (!searchStr && whereStrMinMax) {
        whereStrMinMax = whereStrMinMax.slice(0, -5); // " AND " = 5
        query += `WHERE ${whereStrMinMax}`;
    } else if (searchStr && whereStrMinMax) {
        query += `WHERE ${whereStrMinMax} ${searchStr}`;
    }
    
    return {query, searchParams};
}

/** Generates an INSERT SQL query dynamically based on input
 * from client. Minimum information require is handle and name.
 */
function makeInsertQuery(reqObj, safeFields) {

    let query = `INSERT INTO jobs (`;
    let valuesArr = [];
    let valueStr = ") VALUES (";
    let idx = 1; 

    for (let key in reqObj) {
        if (safeFields.includes(key)){
            query+= `${key}, `;
            valueStr += `$${idx}, `;
            valuesArr.push(reqObj[key]);
            idx++;
        }
    }

    valueStr = valueStr.slice(0, -2); // ", " = 2
    
    // ", " = 2
    query = query.slice(0, -2) + valueStr + `) RETURNING title, salary, equity, company_handle, date_posted`;
    
    return {query, valuesArr};
}

module.exports = {makeGetQuery, makeInsertQuery};