const sqlForPartialUpdate = require('../../helpers/partialUpdate')

const items = {
  'column1': 'value1',
  '_column2': 'value2', 
  'column3': 'value3'
}


describe("partialUpdate()", () => {
  it("should generate a proper partial update query with all fields",
      function () {
        const response = sqlForPartialUpdate('tests', items, 'testA', 'testB')

        expect(response.query).toEqual('UPDATE tests SET column1=$1, column3=$2 WHERE testA=$3 RETURNING *');
        expect(response.values).toEqual(["value1", "value3", "testB"]);

  });
});

// Add test of just one field, or two fields.

