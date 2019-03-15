CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer,
    description text,
    logo_url text
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL,
    company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted timestamp without time zone DEFAULT NOW() NOT NULL
    CONSTRAINT equity CHECK ((equity<=1))
);

-- CREATE TABLE messages (
--     id SERIAL PRIMARY KEY,
--     from_username text NOT NULL REFERENCES users,
--     to_username text NOT NULL REFERENCES users,
--     body text NOT NULL,
--     sent_at timestamp without time zone NOT NULL,
--     read_at timestamp without time zone
-- );
