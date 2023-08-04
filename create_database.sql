--Uncomment if you want to first delete the database
--Necessary the first time you create the database
--DROP DATABASE mydb;
CREATE DATABASE mydb;

--Uncomment for the first time you're creating the Db
--CREATE USER abuzdin WITH ENCRYPTED PASSWORD 'test';
--GRANT ALL PRIVILEGES ON DATABASE test TO abuzdin;
--CREATE USER jvander WITH ENCRYPTED PASSWORD 'test';
--GRANT ALL PRIVILEGES ON DATABASE test TO jvander;
--CREATE USER hdony WITH ENCRYPTED PASSWORD 'test';
--GRANT ALL PRIVILEGES ON DATABASE test TO hdony;
--CREATE USER ademurge WITH ENCRYPTED PASSWORD 'test';
--GRANT ALL PRIVILEGES ON DATABASE test TO ademurge;
--CREATE USER ejootho WITH ENCRYPTED PASSWORD 'test';
--GRANT ALL PRIVILEGES ON DATABASE test TO ejoo-tho;

--Move into the database mydb
\c mydb

CREATE TYPE status_user AS ENUM('online', 'offline', 'inGame');
CREATE TYPE status_channel AS ENUM('public', 'private', 'protected');

CREATE TABLE IF NOT EXISTS users (
    username            VARCHAR(50)         PRIMARY KEY,
    password            VARCHAR(50)         NOT NULL,
    two__fa_activated   BOOLEAN             NULL DEFAULT false,
    rank                NUMERIC             NULL DEFAULT 0,
    email               VARCHAR(50)         NOT NULL,
    registration_date   TIMESTAMP           NOT NULL,
    profile_picture     VARCHAR(50)         NULL,
    friend_list         VARCHAR(50) ARRAY   NULL,
    status              status_user         NOT NULL DEFAULT 'online',
    blocked_users       VARCHAR(50) ARRAY   NULL,
    number_victory      NUMERIC             NULL DEFAULT 0,
    number_defeat       NUMERIC             NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
    id                  SERIAL              PRIMARY KEY,
    text                VARCHAR(1024)       NOT NULL,
    writer              VARCHAR(50)         REFERENCES users(username) NOT NULL
);

CREATE TABLE IF NOT EXISTS matches (
    id                  SERIAL              PRIMARY KEY,
    username            VARCHAR(50)         REFERENCES users(username) NOT NULL,
    opponent            VARCHAR(50)         REFERENCES users(username) NOT NULL,
    score_user          NUMERIC             NOT NULL,
    score_opponent      NUMERIC             NOT NULL,
    map                 VARCHAR(50)         NOT NULL,
    bonus               VARCHAR(50) ARRAY   NULL
);

CREATE TABLE IF NOT EXISTS channels (
    id                  SERIAL              PRIMARY KEY,
    status              status_channel      NULL DEFAULT 'public',
    password            VARCHAR(100)        NULL,
    administratros      VARCHAR(50) ARRAY   NOT NULL,
    owner               VARCHAR(50)         REFERENCES users(username) NOT NULL,
    muted_users         VARCHAR(50) ARRAY   NULL,
    banned_users        VARCHAR(50) ARRAY   NULL,
    messages            NUMERIC     ARRAY   NULL,
    users               VARCHAR(50) ARRAY   NOT NULL
);

--Insert info in tables

INSERT INTO users(username, password, email, registration_date, status, rank, number_defeat, number_victory)
VALUES('jvander', 'test', 'jvander@student.s19.be', CURRENT_TIMESTAMP, 'online', 3, 2, 1);

INSERT INTO users(username, password, email, registration_date, status, rank, number_defeat, number_victory)
VALUES('abuzdin', 'test', 'abuzdin@student.s19.be', CURRENT_TIMESTAMP, 'online', 2, 1, 2);

INSERT INTO users(username, password, email, registration_date, status, rank, number_defeat, number_victory)
VALUES('ejoo-tho', 'test', 'ejootho@student.s19.be', CURRENT_TIMESTAMP, 'online', 1, 0, 3);

INSERT INTO users(username, password, email, registration_date, status, rank, number_defeat, number_victory)
VALUES('hdony', 'test', 'hedony@student.s19.be', CURRENT_TIMESTAMP, 'online', 4, 3, 0);

INSERT INTO messages(writer, text)
VALUES('abuzdin', 'Hello guys! How are you doing');

INSERT INTO messages(writer, text)
VALUES('jvander', 'Hello ! Fine and you ?');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('jvander', 'hdony', 3, 4, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('jvander', 'abuzdin', 2, 1, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('jvander', 'ejoo-tho', 7, 2, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('ejoo-tho', 'jvander', 2, 7, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('abuzdin', 'jvander', 1, 2, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('hdony', 'jvander', 4, 3, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('ejoo-tho', 'hdony', 2, 7, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('ejoo-tho', 'abuzdin', 5, 7, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('hdony', 'ejoo-tho', 7, 2, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('hdony', 'abuzdin', 7, 5, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('abuzdin', 'hdony', 5, 7, 'default');

INSERT INTO matches(username, opponent, score_opponent, score_user, map)
VALUES('abuzdin', 'ejoo-tho', 7, 5, 'default');

INSERT INTO channels(administratros, owner, messages, users)
VALUES (ARRAY ['jvander', 'hdony'], 'jvander', ARRAY [1,2], ARRAY['jvander', 'abuzdin', 'ejoo-tho', 'hdony'])