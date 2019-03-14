const { makeGetQuery, makeInsertQuery } = require('../../helpers/queryMakers')

const items = {
  'handle': 'value1',
  'name': 'value2', 
  'num_employees': 'value3',
  'description': 'test description',
  'logo_url': 'www.testing.com'
}

describe("makeInsertQuery()", () => {
  it("generates variable INSERT query string depending on user input",
      function () {
        const response = makeInsertQuery(items);

        expect(typeof response).toEqual('object');
        expect(typeof response.query).toEqual('string');
        expect(Array.isArray(response.valuesArr)).toEqual(true);
        expect(response.valuesArr).toEqual(["value1", "value2", "value3", "test description", "www.testing.com"]);

  });
});

let searchItems = {
  'search': 'value1',
  'min_employees': 'value2', 
  'max_employees': 'value3'
}

describe("makeGetQuery()", () => {
  it("generates variable SELECT query string depending on user input",
      function () {
        const response = makeGetQuery(searchItems);
        
        expect(typeof response).toEqual('object');
        expect(typeof response.query).toEqual('string');
        expect(response.query).toEqual('SELECT handle, name FROM companies WHERE num_employees>$1 AND num_employees<$2 AND name ILIKE $3 OR name ILIKE $4 OR name ILIKE $5');
        expect(Array.isArray(response.searchParams)).toEqual(true);
        expect(response.searchParams).toEqual(["value2", "value3", "value1%", "%value1%", "%value1"]);

  });
});  