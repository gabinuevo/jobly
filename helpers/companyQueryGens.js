/** Help functions to generate dynamic SQL queries */

/** Generates search query to search for, depending on input:
 * - All companies,
 * - A company by name or partial name,
 * - Companies with min max employee requirements,
 * - A company ny name or partial name and min max employees.
 */
function makeGetQuery(reqObj) {
// Fixme function name and docstring
    let idx = 1;
    let whereStrMinMax = "";
    let searchStr = "";
    let searchParams = [];

    let query = `SELECT handle, name FROM companies `;

    // Intentionally not letting searches for companies with 0 employees pass.
    if (reqObj["min_employees"]) {
        whereStrMinMax += `num_employees>$${idx} AND `;
        searchParams.push(reqObj["min_employees"]);
        idx += 1;
    }

    if (reqObj["max_employees"]) {
        whereStrMinMax += `num_employees>$${idx} AND `;
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

    let query = `INSERT INTO companies (`;
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
    query = query.slice(0, -2) + valueStr + `) RETURNING handle, name,
    num_employees, description, logo_url`;
    
    return {query, valuesArr};
}

module.exports = {makeGetQuery, makeInsertQuery};