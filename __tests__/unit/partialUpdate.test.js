const sqlForPartialUpdate = require('../../helpers/partialUpdate')

const items = {
  'column1': 'value1',
  '_column2': 'value2', 
  'column3': 'value3'
}


describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field",
      function () {
        const response = sqlForPartialUpdate('tests', items, 'testA', 'testB')

        // FIXME: write real tests!
        expect(typeof response).toEqual('object');
        expect(typeof response.query).toEqual('string');
        expect(response.query).toEqual('UPDATE tests SET column1=$1, column3=$2 WHERE testA=$3 RETURNING *');
        expect(Array.isArray(response.values)).toEqual(true);
        expect(response.values).toEqual(["value1", "value3", "testB"]);

  });
});

