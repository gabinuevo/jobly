const { makeGetQuery, makeInsertQuery } = require('../../helpers/queryMakers')

const items = {
  'search': 'value1',
  'min_employees': 'value2', 
  'max_exmployees': 'value3'
}

// Needs much modification!
describe("queryMakers()", () => {
  it("generates variable query string depending on search and employee input",
      function () {
        const response = sqlForPartialUpdate('tests', items, 'testA', 'testB')

        expect(typeof response).toEqual('object');
        expect(typeof response.query).toEqual('string');
        expect(response.query).toEqual('UPDATE tests SET column1=$1, column3=$2 WHERE testA=$3 RETURNING *');
        expect(Array.isArray(response.values)).toEqual(true);
        expect(response.values).toEqual(["value1", "value3", "testB"]);

  });
});

