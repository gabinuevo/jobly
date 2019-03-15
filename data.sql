CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer,
    description text,
    logo_url text
);

CREATE TABLE jobs (
    id int AUTO_INCREMENT PRIMARY KEY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL,
    FOREIGN KEY (company_handle) REFERENCES companies (handle) ON DELETE CASCADE,
    date_posted timestamp without time zone NOT NULL
);

-- CREATE TABLE messages (
--     id SERIAL PRIMARY KEY,
--     from_username text NOT NULL REFERENCES users,
--     to_username text NOT NULL REFERENCES users,
--     body text NOT NULL,
--     sent_at timestamp without time zone NOT NULL,
--     read_at timestamp without time zone
-- );
