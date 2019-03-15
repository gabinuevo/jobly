const Company = require("../../models/company");
const Job = require("../../models/job");

process.env.NODE_ENV = "test";

const app = require("../../app");

const db = require("../../db");

// in terminal, make sure to do: 
// psql jobly-test <  data.sql

beforeEach(async () => {
    // Create two test companies
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

    // Create two job listngs.
    await db.query(`
        INSERT INTO jobs (
            title,
            salary,
            equity,
            company_handle,
            date_posted)
        VALUES (
            'TESTJOB1', 
            '500000.00', 
            '0.05',
            'TEST',
            'Fri Mar 10 2019 12:01:47'
            ), (
                'TESTJOB2', 
                '50000.00', 
                '0.12',
                'TEST2',
                'Fri Mar 14 2019 12:01:47'
                )
    `);
});

// Clear out tables
afterEach(async () => {
    await db.query(`DELETE FROM jobs`);
    await db.query(`DELETE FROM companies`);
});

afterAll(async function () {
    // close db connection
    await db.end();
});

const searchParams = {
    search: "job",
    min_salary: 10000.00,
    min_equity: .01
}

// As set should return no jobs.
const partialSearchParams1 = {
    min_salary: 600000.00,
    min_equity: 0.06
}

const partialSearchParams2 = {
    search: "job",
    min_salary: 100000.00
}

const emptySearchParams = {
    search: undefined,
    min_salary: undefined,
    min_equity: undefined
}

describe("Job.searchByTerms()", () => {
    it("returns all jobs when no params are passed in",
        async function () {
          const response = await Job.searchByTerms(emptySearchParams);
          expect(response).toEqual([ 
          { id: expect.any(Number),
            title: 'TESTJOB2',
            salary: 50000,
            equity: 0.12,
            company_handle: 'TEST2' },
            { id: expect.any(Number),
            title: 'TESTJOB1',
            salary: 500000,
            equity: 0.05,
            company_handle: 'TEST' } ]);
    });

    // it("returns all results that match full params sent in by user",
    //     async function () {
    //       const response = await Company.searchByTerms(searchParams);

    //       expect(response).toEqual([ { handle: "TEST", name: "TESTING" } ]);
    // });

    // it("returns all results that match partial params sent in by user",
    //     async function () {
    //       const response = await Company.searchByTerms(partialSearchParams1);
    //       const response2 = await Company.searchByTerms(partialSearchParams2);

    //       expect(response).toEqual([ { handle: "TEST", name: "TESTING" } ]);
    //       expect(response2).toEqual([ { handle: "TEST2", name: "UNITEXAM" } ]);
    // });
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

// describe("Company.addCompany()", () => {
//     it("returns data of new company added into database",
//         async function () {
//             const response = await Company.addCompany(GOOD_TEST_COMPANY);

//             expect(response).toEqual({...GOOD_TEST_COMPANY, logo_url: null})
            
//             const totalCompanies = await Company.searchByTerms(emptySearchParams);
//             const allCompanyHandles = totalCompanies.map((obj) => {
//                 return obj.handle
//             })

//             expect(allCompanyHandles).toEqual(["TEST", "TEST2", "TEST3"])
//     });
//     it("does not accept invalid params",
//         async function () {
//             const response = await Company.addCompany(BAD_TEST_COMPANY).catch(
//                 e => expect(e).toEqual({
//                     "message": "Company handle already taken",
//                     "status": 400,
//                   })
//             );
            
//             const totalCompanies = await Company.searchByTerms(emptySearchParams);

//             expect(totalCompanies.length).toEqual(2);
//     });
// });

// describe("Company.getOneCompany()", () => {
//     it("returns data of specified company",
//         async function () {
//             const response = await Company.getOneCompany("TEST");

//             expect(typeof response).toEqual("object");
//             expect(response).toEqual({ handle: "TEST",
//             name: "TESTING",
//             num_employees: 5,
//             description: "DESCRIBE TEST",
//             logo_url: "www.test.com" });

//     });
//     it("returns undefined object if not found",
//         async function () {
//             const response = await Company.getOneCompany("FALSE_TEST");
            
//             expect(response).toEqual(undefined);
            
//             const totalCompanies = await Company.searchByTerms(emptySearchParams);

//             expect(totalCompanies.length).toEqual(2);
//     });
// });