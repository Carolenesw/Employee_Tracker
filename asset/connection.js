
// const application = require("./asset/app")
const getData = require("./employee_prompt");

const mysql = require("mysql");

// // set up connection to sql server and database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
    database: "employee_db",
  });
  
  // // create function to handle connection
  connection.connect(function (err) {
    if (err) {
      console.error("error connecting: " + err.stack);
    }
  
    console.log("DB connection established id: " + connection.threadId);
    
    // get employee's prompt after connection is made
      // getData()
      // console.log("View employees:", viewEmployees)
    });
   
 module.exports = connection;