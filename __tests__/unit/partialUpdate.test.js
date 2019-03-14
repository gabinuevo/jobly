const sqlForPartialUpdate = require('../../helpers/partialUpdate')

const items1 = {
  'column1': 'value1',
  '_column2': 'value2', 
  'column3': 'value3'
}

const items2 = {
  'column1': 'value1'
}


describe("partialUpdate()", () => {
  it("should generate a proper partial update query with all fields",
      function () {
        const response = sqlForPartialUpdate('tests', items1, 'testA', 'testB');

        expect(response.query).toEqual('UPDATE tests SET column1=$1, column3=$2 WHERE testA=$3 RETURNING *');
        expect(response.values).toEqual(["value1", "value3", "testB"]);

  });

  it("should generate a proper partial update query with just 1 field",
      function () {
        const response = sqlForPartialUpdate('tests', items2, 'testA', 'testB');

        expect(response.query).toEqual('UPDATE tests SET column1=$1 WHERE testA=$2 RETURNING *');
        expect(response.values).toEqual(["value1", "testB"]);

  });
});
