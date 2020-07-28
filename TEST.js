/ get all employees data
// app.get("/employees", (req, res) => {
//   connection.query("SELECT * FROM employees", (err, rows, fields) => {
//     if (!err) {
//       console.log(rows);
//       res.send(rows);
//     } else console.log(err);
//   });
// });




function deleteEmployee() {
    connection.query("DELETE * FROM employees WHERE ? AND emp_id = ?",[req.params.id], (err, result))
  
        if (err) 
        throw err;
        console.log(result.emp_id + " record(s) deleted");
        connection.end();
  
  }
  
  deleteEmployee()



  function viewEmployeesByDep() {
    connection.query("SELECT * FROM department", function (err, results) {
      if (err) throw err;
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "Select Role",
          choices: function () {
            let allDepartmentName = [];
            for (let i = 0; i < results.length; i++) {
              allDepartmentName.push(results[i].name);
              console.log(results.name);
            }
            return allDepartmentName;
          },
        })
        .then(function(answer){
          var query = "SELECT e.first_name, e.last_name, d.name FROM employee e, role r, department d WHERE e.role_id = r.id AND r.department_id = d.id AND  ?";
          connection.query(query, { name: answer.name}, function(err, results) {
            if (err) throw err;
            console.table(results);
            connection.end();
            return results;
          });
      });
    });
  }
  