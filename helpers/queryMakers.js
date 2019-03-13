function makeQueryObj(reqObj) {

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

function makeInsertQuery(reqObj) {

    let idx = 1;
    let whereStrMinMax = '';
    let searchParams = [];

    let query = `INSERT INTO companies (`;
    let valuesArr = [];
    let valueStr = ') VALUES (';
    let counter = 1; 

    for (let key in reqObj) {
        query+= `${key}, `;
        valueStr += `$${counter}, `;
        valuesArr.push(reqObj[key]);
        counter++;
    }

    valueStr = valueStr.slice(0, -2);

    query = query.slice(0, -2) + valueStr + ')';
    
    return {query, valuesArr};
}

let obj = {
    'handle': 'ABC',
    'name': 'alphabet', 
    'num_employees': 333, 
    'description': 'hehehehehehehe', 
    'logo_url': 'google.com'
}

module.exports = {makeQuery, makeInsertQuery};