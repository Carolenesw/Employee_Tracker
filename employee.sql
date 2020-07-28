-- create employee database with primary key for query selection

DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT, 
    PRIMARY KEY (id)
);

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL NOT NULL,
department_id INT,
PRIMARY KEY (id)
);

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

-- populate employees table
SELECT * FROM employees;

INSERT INTO employees (first_name, last_name, role_id, manager_id)  
VALUES ("John","Morris", 01, 1), ("David","Brown", 04, 2),  
("Christopher","Thompson", 03, 1),("Masha","Matthews", 03, 1),  
("Daniel","Kelly", 02, 2), ("Angela", "Dawkins", 03, 2);


-- populate department table
SELECT * FROM department;

INSERT INTO department (name) 
VALUES ("Production"),("Finance"), 
("Marketing"), ("Infomation Technology"), ("Human Resources");

-- populate role table
INSERT INTO role (title, salary, department_id)  
VALUES ("Manager", 85000, 1),("Engineer", 73000, 2),  
("Analyst", 65000, 3), ("HR/Accountant", 55000, 4)

