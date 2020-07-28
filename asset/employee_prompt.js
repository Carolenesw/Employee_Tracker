
const inquirer = require("inquirer");


// require app.js employee functions
const {
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
  deleteEmployee}
 = require("../employee");

// const viewEmployees = require("../employee");
//   const getEmployees = require("../employee");
//   const viewDepartment = require("../employee");
//   const getDepartment = require("../employee");
//   const viewAllRole = require("../employee");
//   const getAllRole = require("../employee");
//   const viewManager = require("../employee");
//   const getManager = require("../employee");
//   const viewEmployeesByDep = require("../employee");
//   const addDepartment = require("../employee");
//   const addNewRole = require("../employee");
//   const employeeByRole = require("../employee");
//   const addNewEmployee = require("../employee");
//   const updateEmployeeRole = require("../employee");
//   const deleteEmployee = require("../employee");

  console.log("View employees:", viewEmployees)
  console.log("View manager:", viewManager)
// create function to prompt employee for query/selection
const getData = function() {
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
      "Update/Edit Employee Role",
      "Delete/Remove Employee",
      
    ],
  })
    .then(function(answer) {
      console.log(answer)
      // get user response
      switch (answer.query) {
        case "View All Employees":
          viewEmployees();
          break;
  
        case "View All Departments":
          viewDepartment();
          break;

        case "View Employee Roles":
        viewAllRole();
        break;
  
        case "View Employees By Department":
          viewEmployeesByDep();
          break;

        case "View Employees By Manager":
          viewManager();
          break;

        case "View Employees By Role":
          employeeByRole();
          break;

        case "Add New Employee":
          addNewEmployee();
          break;

        case "Add New Department":
          addDepartment();
          break;
        case "Add New Role":
          addNewRole();
          break;
  
        case "Update/Edit Employee Role":
          updateEmployeeRole();
          break;
        
        case "Delete/Remove Employee":
          deleteEmployee()
          break;
                    
        default:
          connection.end()
        
      }
    })
 
}



module.exports = getData