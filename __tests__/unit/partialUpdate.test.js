const sqlForPartialUpdate = require("../../helpers/partialUpdate");
process.env.NODE_ENV = "test";

const items1 = {
  "handle": "value1",
  "_column2": "value2", 
  "column3": "value3"
}

const items2 = {
  "description": "value1"
}

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with all fields",
      function () {
        const response = sqlForPartialUpdate("tests", items1, "testA", "testB", Object.keys(items1));

        expect(response.query).toEqual("UPDATE tests SET handle=$1, column3=$2 WHERE testA=$3 RETURNING *");
        expect(response.values).toEqual(["value1", "value3", "testB"]);
        expect(Object.keys(response).length).toEqual(2);

  });

  it("should generate a proper partial update query with just 1 field",
      function () {
        const response = sqlForPartialUpdate("tests", items2, "testA", "testB", Object.keys(items2));

        expect(response.query).toEqual("UPDATE tests SET description=$1 WHERE testA=$2 RETURNING *");
        expect(response.values).toEqual(["value1", "testB"]);
        expect(Object.keys(response).length).toEqual(2);

  });
});
