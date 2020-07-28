const util = require("util");

const inquirer = require("inquirer");

// // require consoleTable to print MYSQL rows to the console
const consoleTable = require("console.table");

// ------------- functions viewDepartment, viewEmployees viewManager and viewAllRole --
// view all employees
const viewEmployees = function (connection) {
  connection.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    console.table(results);
    connection.end();
    return results;
  });
};

// get Employees using promisified function
const getEmployees = function (connection) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT first_name, last_name FROM employees", function (
      err,
      results
    ) {
      if (err) return reject(err);
      let employeeNames = [];
      for (var i = 0; i < results.length; i++) {
        employeeNames.push(results[i].first_name + " " + results[i].last_name);
        console.log("All Employees:", employeeNames);
      }
      return resolve(employeeNames);
    });
  });
};

// view Employees using promisified function
const viewDepartment = function (connection) {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    connection.end();
    return results;
  });
};

// get departments with Promisified function
const getDepartment = async function (connection) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT name FROM department", function (err, results) {
      if (err) return reject(err);
      let allDepartments = [];
      for (var i = 0; i < results.length; i++) {
        allDepartments.push(results[i].name);
        console.log("All Departments:", allDepartments);
      }
      return resolve(allDepartments);
    });
  });
};

// view Employees using
const viewAllRole = function (connection) {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    console.table(results);
    connection.end();
    return results;
  });
};

// get all roles Promisified function
const getAllRole = async function (connection) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT title FROM role", function (err, results) {
      if (err) return reject(err);
      let employeeRoles = [];
      for (var i = 0; i < results.length; i++) {
        // push results in an array
        employeeRoles.push(results[i].title);
        console.log("employee Roles:", employeeRoles);
        // return resolve(employeeRoles);
      }
      return resolve(employeeRoles);
    });
  });
};

// view employees by manager managers with Promisified function
const viewManager = function (connection) {
  connection.query(
    "SELECT first_name, last_name, role_id, manager_id FROM employees INNER JOIN role ON employees.role_id = role.id WHERE role.title = 'Manager'",
    function (err, results) {
      if (err) throw err;
      console.table(results);
      connection.end();
      return results;
    }
  );
};

const getManager = async function (connection) {
  return new Promise((resolve, reject) => {
    // use inner join to link tables for selection
    connection.query(
      "SELECT employees.first_name, employees.last_name FROM employees INNER JOIN role ON employees.role_id = role.id WHERE role.title = 'Manager'",
      function (err, results) {
        if (err) return reject(err);
        let managerNames = [];
        for (var i = 0; i < results.length; i++) {
          managerNames.push(results[i].first_name + " " + results[i].last_name);
          console.log("Managers:", managerNames);
        }
        return resolve(managerNames);
      }
    );
  });
};

//---------- functions to select employee based on department role or manager---------

// view all employees by department
const viewEmployeesByDep = function (connection) {
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
};

// view all employees by Role
const employeeByRole = function (connection) {
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
};

//---------- functions to add department, employee and role -----------------------

// add a new department
const addDepartment = function (connection) {
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
          console.log(
            result.affectedRows +
              " record(s) updated" +
              answer.name +
              " " +
              "Department!"
          );
        }
      );
      connection.end();
    });
};

// add new role
const addNewRole = async function (connection) {
  let departmentID = await getDepartment(connection);
  console.log("Departments Available:", departmentID);
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
        choices: departmentID,
      },
    ])
    .then(function (answer) {
      connection.query(
        "SELECT id FROM department WHERE ?",
        { name: answer.department },
        function (err, department) {
          if (err) throw err;
          connection.query(
            `INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", "${answer.salary}", "${department[0].id}")`,
            function (err, result) {
              if (err) throw err;
              console.log(
                result.affectedRows +
                  " record(s) updated for " +
                  answer.department +
                  " " +
                  "Role!"
              );
              connection.end();
            }
          );
        }
      );
    });
};

// add new employee by role
const addNewEmployee = async function (connection) {
  //array for the choices
  let emplRoles = await getAllRole(connection);
  let viewManagers = await getManager(connection);

  let answer = await inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter employee's first name: ",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter Employee's last name: ",
      },
      {
        name: "title",
        type: "list",
        message: "Select Employee's Role:",
        choices: emplRoles,
      },
      {
        name: "manager",
        type: "list",
        message: "Select Employee's Manager: ",
        choices: viewManagers,
      },
    ])
    .then(function (answers) {
      console.log("Add employee answers:", answers);

      // get managers id to link to manager's name
      connection.query(
        "SELECT id FROM role WHERE ?",
        { title: answers.title },
        function (err, roleId) {
          if (err) throw err;
          console.log("role:", roleId);

          // use spilt and join to get manager's first name and last name
          let mgrFirstName = answers.manager.split(" ").slice(0, -1).join(" ");
          let mgrLastName = answers.manager.split(" ").slice(-1).join(" ");

          // link id and manager's name
          connection.query(
            "SELECT id FROM employees WHERE ? AND ?",
            [{ first_name: mgrFirstName }, { last_name: mgrLastName }],
            function (err, managerId) {
              if (err) {
                console.log(err);
                throw err;
              }
              // insert query selection
              connection.query(
                `INSERT INTO employees (first_name, last_name, role_id,manager_id ) VALUES ("${answers.firstName}", "${answers.lastName}", "${roleId[0].id}", "${managerId[0].id}")`,
                function (err, result) {
                  if (err) throw err;
                  console.log(
                    result.affectedRows +
                      " record(s) updated for " +
                      answers.firstName +
                      " " +
                      answers.lastName
                  );
                  connection.end();
                }
              );
            }
          );
        }
      );
    });
};

// update employees roles
const updateEmployeeRole = async function (connection) {
  let empNames = await getEmployees(connection);
  let empRoles = await getAllRole(connection);

  inquirer
    .prompt([
      {
        name: "name",
        type: "list",
        message: "Select Employee: ",
        choices: empNames,
      },
      {
        name: "title",
        type: "list",
        message: "Add Employee's New Role: ",
        choices: empRoles,
      },
    ])
    .then(function (answer) {
      let firstName = answer.name.split(" ").slice(0, -1).join(" ");
      let lastName = answer.name.split(" ").slice(-1).join(" ");
      connection.query(
        "SELECT id FROM role WHERE ?",
        { title: answer.title },
        function (err, result) {
          if (err) throw err;
          connection.query(
            "UPDATE employees SET ? WHERE ? AND ?",
            [
              { role_id: result[0].id },
              { first_name: firstName },
              { last_name: lastName },
            ],
            function (err, result) {
              if (err) throw err;
              console.log(
                result.affectedRows + " Employee's record(s) updated"
              );
              connection.end();
            }
          );
        }
      );
    });
};

// create function to delete employee from database
const deleteEmployee = async function (connection) {
  let emplNames = await getEmployees();
  inquirer
    .prompt({
      name: "employee",
      type: "list",
      message: "Please select Employee to be deleted?",
      choices: emplNames,
    })
    .then(function (answer) {
      let emplFirstName = answer.employee.split(" ").slice(0, -1).join(" ");
      let emplLastName = answer.employee.split(" ").slice(-1).join(" ");

      connection.query(
        "DELETE FROM employees WHERE ? AND ?",
        [{ first_name: emplFirstName }, { last_name: emplLastName }],
        function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " Employee's record(s) deleted");
          connection.end();
        }
      );
    });
};

// export functions to employee_prompts file
module.exports = {
  viewEmployees,
  getEmployees,
  viewDepartment,
  getDepartment,
  viewAllRole,
  getAllRole,
  viewManager,
  getManager,
  viewEmployeesByDep,
  addDepartment,
  addNewRole,
  employeeByRole,
  addNewEmployee,
  updateEmployeeRole,
  deleteEmployee,
};
