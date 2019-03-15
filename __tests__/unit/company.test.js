const Company = require("../../models/company");

process.env.NODE_ENV = "test";

const app = require("../../app");

const db = require("../../db");

// in terminal, make sure to do: 
// psql jobly-test <  data.sql

beforeEach(async () => {
    await db.query(`
        INSERT INTO companies (
            handle,
            name,
            logo_url,
            description,
            num_employees)
        VALUES (
            'TEST', 
            'TESTING', 
            'www.test.com', 
            'DESCRIBE TEST', 
            5), (
                'TEST2', 
                'UNITEXAM', 
                'www.test.com2', 
                'DESCRIBE TEST2',
                52)
    `);
});

afterEach(async () => {
    await db.query(`DELETE FROM companies`);
});

afterAll(async function () {
    // close db connection
    await db.end();
});

const searchParams = {
    search: "test",
    min_employees: 2,
    max_employees: 50
}

const partialSearchParams1 = {
    min_employees: 2,
    max_employees: 50
}

const partialSearchParams2 = {
    search: "unit",
    min_employees: 2
}

const emptySearchParams = {
    search: undefined,
    min_employees: undefined,
    max_employees: undefined
}

describe("Company.getAll()", () => {
    it("returns all companies when no params are passed in",
        async function () {
          const response = await Company.getAll(emptySearchParams);
          expect(response).toEqual([ { handle: "TEST", name: "TESTING" }, { handle: "TEST2", name: "UNITEXAM" } ]);
    });

    it("returns all results that match full params sent in by user",
        async function () {
          const response = await Company.getAll(searchParams);

          expect(response).toEqual([ { handle: "TEST", name: "TESTING" } ]);
    });

    it("returns all results that match partial params sent in by user",
        async function () {
          const response = await Company.getAll(partialSearchParams1);
          const response2 = await Company.getAll(partialSearchParams2);

          expect(response).toEqual([ { handle: "TEST", name: "TESTING" } ]);
          expect(response2).toEqual([ { handle: "TEST2", name: "UNITEXAM" } ]);
    });
});

const GOOD_TEST_COMPANY = {
    handle: "TEST3",
    name: "TESTING3",
    num_employees: 103,
    description: "TESTING ADDCOMPANY"
}

const BAD_TEST_COMPANY = {
    handle: "TEST",
    name: "TESTING4",
    description: "TESTING ADDCOMPANY"
}

describe("Company.addCompany()", () => {
    it("returns data of new company added into database",
        async function () {
            const response = await Company.addCompany(GOOD_TEST_COMPANY);

            expect(response).toEqual({...GOOD_TEST_COMPANY, logo_url: null})
            
            const totalCompanies = await Company.getAll(emptySearchParams);
            const allCompanyHandles = totalCompanies.map((obj) => {
                return obj.handle
            })

            expect(allCompanyHandles).toEqual(["TEST", "TEST2", "TEST3"])
    });
    it("does not accept invalid params",
        async function () {
            const response = await Company.addCompany(BAD_TEST_COMPANY).catch(
                e => expect(e).toEqual({
                    "message": "Company handle already taken",
                    "status": 400,
                  })
            );
            
            const totalCompanies = await Company.getAll(emptySearchParams);

            expect(totalCompanies.length).toEqual(2);
    });
});

describe("Company.getOneCompany()", () => {
    it("returns data of specified company",
        async function () {
            const response = await Company.getOneCompany("TEST");

            expect(typeof response).toEqual("object");
            expect(response).toEqual({ handle: "TEST",
            name: "TESTING",
            num_employees: 5,
            description: "DESCRIBE TEST",
            logo_url: "www.test.com" });

    });
    it("returns undefined object if not found",
        async function () {
            const response = await Company.getOneCompany("FALSE_TEST");
            
            expect(response).toEqual(undefined);
            
            const totalCompanies = await Company.getAll(emptySearchParams);

            expect(totalCompanies.length).toEqual(2);
    });
});