const express = require("express");
// var exphbs = require("express-handlebars");
const mysql = require("mysql");
const inquirer = require("inquirer");

// require consoleTable to print MYSQL rows to the console
const consoleTable = require("console.table");
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
  database: "employee_db",
});

// create function to handle connection
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }

  console.log("DB connection established id: " + connection.threadId);
  // get employee's data after connection is made
  // getData();
});

// create function to prompt for employee query/selection
function getData() {
  inquirer.prompt({
    name: "query",
    type: "list",
    message: "Please select action to be taken?",
    choices: [
      "View All Employees",
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
      "View the total utilized Budget of a Department",
    ],
  });
}

// get all employees data
// app.get("/employees", (req, res) => {
//   connection.query("SELECT * FROM employees", (err, rows, fields) => {
//     if (!err) {
//       console.log(rows);
//       res.send(rows);
//     } else console.log(err);
//   });
// });

function viewEmployees() {
  connection.query("SELECT * FROM employees", function(err, results) {
      if (err) 
      throw err;
      console.table(results);
      connection.end();
      return results;

  });
}
// viewEmployees()

// view all departments 
function viewDepartment() {
  connection.query("SELECT * FROM department", function(err, results) {
      if (err) 
      throw err;
      console.table(results);
      connection.end();
      return results;

  });
}
viewDepartment()

// start server
app.listen(PORT, () => {
  console.log("Server listening on: http://localhost:" + PORT);
});
