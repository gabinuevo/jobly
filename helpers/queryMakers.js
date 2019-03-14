/** Help functions to generate dynamic SQL queries */

/** Generates search query to search for, depending on input:
 * - All companies,
 * - A company by name or partial name,
 * - Companies with min max employee requirements,
 * - A company ny name or partial name and min max employees.
 */
function makeGetQuery(reqObj) {

    let idx = 1;
    let whereStrMinMax = '';
    let searchParams = [];

    let query = `SELECT handle, name FROM companies `;

    for (let key in reqObj) {
        if (key === "min_employees" && reqObj["min_employees"]) {
            whereStrMinMax += `num_employees>$${idx} AND `;
            searchParams.push(reqObj[key]);
            idx += 1;
        }
        if (key === "max_employees" && reqObj["max_employees"]) {
            whereStrMinMax += `num_employees<$${idx} AND `;
            searchParams.push(reqObj[key]);
            idx += 1;
        }
    }
 
    let searchStr = '';

    for (let key in reqObj) {
        if (key === "search" && reqObj["search"]) {
            searchStr += `name ILIKE $${idx} OR `;
            searchParams.push(`${reqObj[key]}%`);
            idx += 1;
            searchStr += `name ILIKE $${idx} OR `;
            searchParams.push(`%${reqObj[key]}%`);
            idx += 1;
            searchStr += `name ILIKE $${idx} OR `;
            searchParams.push(`%${reqObj[key]}`);
            idx += 1;
        }
    }

    if (searchStr && !whereStrMinMax) {
        const searchTerms = searchStr.slice(0, -4);
        query += `WHERE ${searchTerms}`;
    } else if (!searchStr && whereStrMinMax) {
        whereStrMinMax = whereStrMinMax.slice(0, -5);
        query += `WHERE ${whereStrMinMax}`;
    } else if (searchStr) {
        whereStrMinMax = whereStrMinMax.slice(0, -4);
        query += whereStrMinMax;
    }
    
    return {query, searchParams};
}

/** Generates an INSERT SQL query dynamically based on input
 * from client. Minimum information require is handle and name.
 */
function makeInsertQuery(reqObj) {

    let query = `INSERT INTO companies (`;
    let valuesArr = [];
    let valueStr = ') VALUES (';
    let idx = 1; 

    for (let key in reqObj) {
        query+= `${key}, `;
        valueStr += `$${idx}, `;
        valuesArr.push(reqObj[key]);
        idx++;
    }

    valueStr = valueStr.slice(0, -2);

    query = query.slice(0, -2) + valueStr + `) RETURNING handle, name,
    num_employees, description, logo_url`;
    
    return {query, valuesArr};
}

module.exports = {makeGetQuery, makeInsertQuery};