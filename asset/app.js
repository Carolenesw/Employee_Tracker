// ------------- functions viewDepartment, viewEmployees viewManager and viewAllRole --
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
  async function viewAllRole() {
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
    });
  }
   
  // viewAllRole()
  
  
  // view employees by manager managers with Promisified function
  async function viewManager() {
    console.log("VIEW MANAGEr XXXXXXXXXXXX")
   return new Promise((resolve, reject) => {
    // use inner join to link tables for selection
    connection.query("SELECT employees.first_name, employees.last_name FROM employees INNER JOIN role ON employees.role_id = role.id WHERE role.title = 'Manager'",
      function (err, results) {
        if (err) return reject(err); 
       console.log("manager view YYYYYYYY:", results)
       
        let managerNames = [];
  
        for (var i = 0; i < results.length; i++){
          managerNames.push(results[i].first_name + " " + results[i].last_name);
          console.log("Managers:", managerNames)
      }
      return resolve(managerNames);
      // return managerNames
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
          }
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
  
  
  // add new employee by role 
  async function addNewEmployee(){
    
    let emplRoles = await viewAllRole(); //array for the choices
    console.log("employee role:", emplRoles)
    let viewManagers = await viewManager();
    console.log("view maanger:", viewManagers)
    
    let answer = await inquirer
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
    .then(function (answers){
      console.log("Add employee answers:", answers)
      connection.query("SELECT id FROM employees WHERE ?", {name:answers.title}, function(err, department){
        if (err) throw err;
        connection.query(`INSERT INTO employees (first_name, last_name, manager_id ) VALUES ("${answers.firstName}", "${answers.lastName}", "${answers.title}", "${answers.manager}")`, function(err, result){
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
          connection.end('Employee added successfully!');
        })
      });
  
      
  })
  }
  
   
  
  addNewEmployee()
  // employeeByRole()
  // viewManager()
  
  // update employee

//   exports employees functions for database to employee.js file
  module.exports = {
viewEmployees, 
viewDepartment,
viewAllRole, 
viewManager,
viewEmployeesByDep, 
employeeByRole,
addDepartment,
addNewRole,
addNewEmployee


  }