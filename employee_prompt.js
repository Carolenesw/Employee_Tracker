const inquirer = require("inquirer");

// require employee.js employee functions
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
 = require("./employee");

  console.log("View employees:", viewEmployees)
  console.log("View manager:", viewManager)
// create function to prompt employee for query/selection
const getData = function(connection) {
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
          viewEmployees(connection);
          break;
  
        case "View All Departments":
          viewDepartment(connection);
          break;

        case "View Employee Roles":
        viewAllRole(connection);
        break;
  
        case "View Employees By Department":
          viewEmployeesByDep(connection);
          break;

        case "View Employees By Manager":
          viewManager(connection);
          break;

        case "View Employees By Role":
          employeeByRole(connection);
          break;

        case "Add New Employee":
          addNewEmployee(connection);
          break;

        case "Add New Department":
          addDepartment(connection);
          break;
        case "Add New Role":
          addNewRole(connection);
          break;
  
        case "Update/Edit Employee Role":
          updateEmployeeRole(connection);
          break;
        
        case "Delete/Remove Employee":
          deleteEmployee(connection)
          break;
                    
        default:
          connection.end()
        
      }
    })
 
}


module.exports = getData