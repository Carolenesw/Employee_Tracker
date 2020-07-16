-- create employee database with primary key for query selction

DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employees (
    emp_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT, 
    PRIMARY KEY (emp_id)
);

CREATE TABLE role (
emp_id INT NOT NULL AUTO_INCREMENT,
tile VARCHAR(30),
salary DECIMAL NOT NULL,
department_id INT,
PRIMARY KEY (emp_id)
)

CREATE TABLE department (
emp_id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (emp_id)
);

