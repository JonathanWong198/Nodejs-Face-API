CREATE DATABASE selfiedata; 

CREATE TABLE selfieinfo(id SERIAL PRIMARY KEY, coordinates GEOGRAPHY(Point), image64 BYTEA, timestamp BIGINT);

