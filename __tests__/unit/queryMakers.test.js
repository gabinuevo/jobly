const { makeGetQuery, makeInsertQuery } = require('../../helpers/queryMakers')

const items = {
  'handle': 'value1',
  'name': 'value2', 
  'num_employees': 'value3',
  'description': 'test description',
  'logo_url': 'www.testing.com'
}

// Needs much modification!
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


     