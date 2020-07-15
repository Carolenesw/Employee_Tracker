const express = require("express");
// var exphbs = require("express-handlebars");
const mysql = require("mysql");
const inquirer = require("inquirer");

const app = express();

// Set the port of our application

const PORT = process.env.PORT || 8080;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up connection to sql server and database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysql",
  database: "employee_db"
});

// create function to handle connection 
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
   
    // get employee's data after connection is made
    getData()
  }

  console.log("connected as id " + connection.threadId);
});

// create function to prompt employee query/selection
function getData() {
    inquirer
      .prompt({
        name: "query",
        type: "list",
        message: "Please select action to be taken?",
        choices: ["View All Employees", 
                  "View All Departments", 
                  "View Employee Roles", 
                  "View Employees By Department",
                  "View Employees By Manager", 
                  "View Employees By Role", 
                  "Add New Employee", 
                  "Add New Department",
                  "Add New Role",
                  "Update/Edit Employee Manager", 
                  "Update/Edit Employee Role", 
                  "Delete/Remove Employee",
                  "View the total utilized Budget of a Department"
                ]
      })
}

// start server 
app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });