
const inquirer = require("inquirer");

// create function to prompt employee for query/selection
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
      // "Add New Employee",
      // "Add New Department",
      // "Add New Role",
      // "Update/Edit Employee Role",
      "Delete/Remove Employee",
      "View the total utilized Budget of a Department",
    ],
  });
}

module.exports = getData