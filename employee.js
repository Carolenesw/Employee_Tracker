const express = require("express");
// var exphbs = require("express-handlebars");
const mysql = require("mysql");
const inquirer = require("inquirer");

// require consoleTable to print MYSQL rows to the console
const consoleTable = require("console.table");
// const { async } = require("rxjs/internal/scheduler/async");
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

  // start server
  app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT);
    // addDepartment()
    // addNewRole()
  });

  // getData();
});

// create function to prompt for employee query/selection
function getData() {
  inquirer.prompt({
    name: "query",
    type: "list",
    message: "Please select action to be taken?",
    choices: [
      // "View All Employees",
      // "View All Departments",
      // "View Employee Roles",
      // "View Employees By Department",
      // "View Employees By Manager",
      // "View Employees By Role",
      "Add New Employee",
      // "Add New Department",
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

// view all roles Promisified function
function viewAllRole() {
  return new Promise((resolve, reject) => {
  connection.query("SELECT title FROM role", function (err, results) {
    if (err) return reject(err);        
      let employeeRoles = [];
      for (var i = 0; i < results.length; i++){
          employeeRoles.push(results[i].title);
          console.log("employee Roles:", employeeRoles)
          // return resolve(employeeRoles);
      }
      return resolve(employeeRoles);
    })
    // console.table(employeeRoles);
    // connection.end();
    // return results;
  });
}
 
// viewAllRole()







// view employees by manager managers with Promisified function
function viewManager() {
  return new Promise((resolve, reject) => {
  // use inner join to link tables for selection
  connection.query("SELECT employees.first_name, employees.last_name FROM employees INNER JOIN role ON employees.role_id = role.id WHERE role.title = 'Manager'",
    function (err, results) {
      if (err) return reject(err); 
      let managerNames = [];

      for (var i = 0; i < results.length; i++){
        managerNames.push(results[i].first_name + " " + results[i].last_name);
        console.log("Managers:", managerNames)
    }
    return resolve(managerNames);
  })

  });
}
// viewManager();


//---------- functions to select employee based on department role or manager---------
// view all employees by department
function viewEmployeesByDep() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Select Department?",
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
        // use left join to  connect rows for relation
        const query =
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
// viewEmployeesByDep();

// view all employees by Role
function employeeByRole() {
  connection.query("SELECT title FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Select Role",
        choices: function () {
          // push all department in array for selection
          let roles = [];
          for (var i = 0; i < results.length; i++) {
            roles.push(results[i].title);
          }
          return roles;
        },
      })
      .then(function (answer) {
        // use INNER join to connect rows for relation
        const query =
          "SELECT employees.first_name, employees.last_name, role.title FROM employees INNER JOIN role ON employees.role_id = role.id AND ?";

        connection.query(query, { title: answer.role }, function (
          err,
          results
        ) {
          if (err) throw err;
          console.table(results);
          connection.end();
          return results;
        });
      });
  });
}
// employeeByRole();



//---------- functions to add department, employee and role -----------------------

// add a new department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Enter new Department: ",
      },
    ])
    .then(function (answer) {
      connection.query(
        `INSERT INTO department (name) VALUES ("${answer.name}")`,
        function (err, result) {
          if (err) throw err;
          // use 'affectRows' default is the number of rows actually changed
          console.log(result.affectedRows + " record(s) updated");
        }
      );
      connection.end();
    });
}
// addDepartment()

async function addNewRole() {
  let departmentID = await viewDepartment()
  inquirer
  .prompt([
    {
      name: "title",
      type: "input",
      message: "Enter new ROLE/Title: ",
    },
    {
      name: "salary",
      type: "input",
      message: "Enter salary: ",
    },
    {
      name: "department",
      type: "list",
      message: "Select a department",
      // choices: await viewDepartment()
    }
  ])
  .then(function (answer){
    connection.query("SELECT id FROM department WHERE ?", {name:answer.department}, function(err, department){
      if (err) throw err;
      connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", "${answer.salary}", "${department[0].id}")`, function(err, result){
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        connection.end();
      })
    });

  });
}

// addNewRole()


// add new employee
async function addNewEmployee(){
  let emplRoles = await employeeByRole();
  let viewManagers = await viewManager();
  
  inquirer
      .prompt([{
          name: "firstName",
          type: "input",
          message: "Enter employee's first name: "
      },
      {
          name: "lastName",
          type: "input",
          message: "Enter employees last name: "
      },
      {
          name: "title",
          type: "list",
          message: "Select Employee Role:",
          choices: emplRoles
      },
      {
          name: "manager",
          type: "list",
          message: "Select Employee's Manager: ",
          choices: viewManagers
      }
  ])
}
addNewEmployee()
// employeeByRole()
// viewManager()

// update employee

