CREATE DATABASE addrbook;

\connect addrbook;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL
);
