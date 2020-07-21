const express = require("express");
// var exphbs = require("express-handlebars");
const mysql = require("mysql");
const inquirer = require("inquirer");

// require consoleTable to print MYSQL rows to the console
const consoleTable = require("console.table");
const { async } = require("rxjs/internal/scheduler/async");
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

// ------------- functions viewDepartment, viewEmployees viewManager and viewAllRole --------------
function viewEmployees() {
  connection.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    console.table(results);
    connection.end();
    return results;
  });
}
// viewEmployees()

// view all departments
function viewDepartment() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    connection.end();
    return results;
  });
}
// viewDepartment()

// view all roles
function viewAllRole() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    console.table(results);
    connection.end();
    return results;
  });
}

// viewAllRole()

// view all managers
function viewManager() {
  connection.query(
    "SELECT id, first_name, last_name, role_id, manager_id FROM employees WHERE id IN (SELECT department_id FROM role WHERE department_id IS NOT NULL)",
    function (err, results) {
      if (err) throw err;
      console.table(results);
      connection.end();
      return results;
    }
  );
}

// need to double check selection is in-accurate
// viewManager()
// viewAllRole()

//---------- functions to select employee based on department role or manager---------
// view all emplyees by department
function viewEmployeesByDep() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Select Role",
        choices: function () {
          // push all department in array for selection
          let allDepartmentName = [];
          for (let i = 0; i < results.length; i++) {
            allDepartmentName.push(results[i].name);
            console.log(results.name);
          }
          return allDepartmentName;
        },
      })
      .then(function (answer) {
        console.log(answer);
        // use left join to  connect table for relation
        var query =
          "SELECT employees.first_name, employees.last_name, role.department_id, department.name FROM employees LEFT JOIN role ON employees.role_id = role.id LEFT JOIN department ON department.id = role.department_id WHERE department.name = ?";

        console.log("query selection:", query, answer.department);

        connection.query(query, answer.department, function (err, results) {
          if (err) throw err;
          console.table(results);
          connection.end();
          return results;
        });
      });
  });
}
viewEmployeesByDep();

//---------- functions to add department, employee and role -----------------------

function addNewRole() {
  // const department = await viewDepartment();
  inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Enter role title: ",
    },
    {
      name: "salary",
      type: "input",
      message: "Enter salary: ",
    },
    // {
    //   name: "department",
    //   type: "list",
    //   message: "Select a department",
    //   choices: department
    // }
  ]);
  // .then(function (answer){
  //   connection.query("SELECT id FROM department WHERE ?", {name:answer.department}, function(err, department){
  //     if (err) throw err;
  //     connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", "${answer.salary}", "${department[0].id}")`, function(err, result){
  //       if (err) throw err;
  //       console.log(result.affectedRows + " record(s) updated");
  //       connection.end();
  //     })
  //   });

  // });
}

// addNewRole()
// addNewEmployee()
// start server
app.listen(PORT, () => {
  console.log("Server listening on: http://localhost:" + PORT);
});
