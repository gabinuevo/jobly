function makeQuery(reqObj) {

    let idx = 1;
    let whereStrMinMax = ''
    let searchParams = [];

    let query = `SELECT handle, name FROM companies WHERE `

    for (let key in reqObj) {
        if (key === "min_employees") {
            whereStrMinMax += `num_employees>$${idx} AND `;
            searchParams.push(reqObj[key]);
            idx += 1;
        }
        if (key === "max_employees") {
            whereStrMinMax += `num_employees<$${idx} AND `;
            searchParams.push(reqObj[key]);
            idx += 1;
        }
    }

    if (whereStrMinMax) {
        query += whereStrMinMax;
    }

    let searchStr = '';

    for (let key in reqObj) {
        if (key === "search") {
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

    if (searchStr) {
        searchTerms = searchStr.slice(0, -4);
        searchStr = `${searchTerms}`;
        query += searchStr;
    }

    return {query, searchParams};
}

module.exports = makeQuery;