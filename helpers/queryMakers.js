function makeQuery(reqObj) {

    let idx = 1;
    let whereStrMinMax = ''
    let searchParams = [];

    let query = `SELECT handle, name FROM companies `

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

    if (whereStrMinMax) {
        query += `WHERE ${whereStrMinMax}`;
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
    } else if (searchStr) {
        const searchTerms = searchStr.slice(0, -4);
        query += searchTerms;
    }
    
    return {query, searchParams};
}

module.exports = makeQuery;