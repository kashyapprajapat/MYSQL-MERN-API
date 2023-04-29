const express  = require('express');
const bodyparser  = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();
const port = process.env.port || 5000;


const app = express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json())

//MYSQLP PART
const pool = mysql.createPool({
     host     : process.env.hostname,
     user     : process.env.user,
     password : process.env.password,
     database : process.env.dbname,
     connectionLimit : 100, //150 is max + 1 for root user
     debug     :  false
})

//get all data
app.get('/api',(req,res)=>{
    pool.getConnection((err,connection) => {
         if(err) throw err;
         connection.query('SELECT * FROM  test',(err,rows)=>{
            connection.release() //return connection to pool
            if(!err)
            {
                res.send(rows);
            }
            else{
                console.log(err)
            }
         })
    })
})

//get only specific record
app.get('/api/:name',(req,res)=>{
    pool.getConnection((err,connection) => {
         if(err) throw err;
         connection.query('SELECT * FROM  test WHERE name = ?',[req.params.name],(err,rows)=>{
            connection.release() //return connection to pool
            if(!err)
            {
                res.send(rows);
            }
            else{
                console.log(err)
            }
         })
    })
})

//DELETE RECORD
app.delete('/api/:name',(req,res)=>{
    pool.getConnection((err,connection) => {
         if(err) throw err;
         connection.query('DELETE FROM  test WHERE name = ?',[req.params.name],(err,rows)=>{
            connection.release() //return connection to pool
            if(!err)
            {
                res.send(`user deleted sucesfully.....[${[req.params.name]}].....`);
            }
            else{
                console.log(err)
            }
         })
    })
})

///ADDD RECORD INTO DATABASE
app.post('/api/add',(req,res)=>{
    pool.getConnection((err,connection) => {
         if(err) throw err;

         const params = req.body;

         connection.query('INSERT INTO test SET ?',params,(err,rows)=>{
            connection.release() //return connection to pool
            if(!err)
            {
                res.send(`USER ADDED SUCESSFULLY  name is ==${params.name}...:)..`);
            }
            else{
                console.log(err)
            }
         })
         console.log(`${req.body} added to databse..  `)
    })
})

//UPDATE USER DETAILS --DONT USE BECAUSE IT WILL UPDATE ALL DATA 
// app.put('/api/update',(req,res)=>{
//     pool.getConnection((err,connection) => {
//          if(err) throw err;
//          const {name,course} = req.body;

//          connection.query('UPDATE test SET  NAME =?,COURSE=?',[name,course],(err,rows)=>{
//             connection.release() //return connection to pool
//             if(!err)
//             {
//                 res.send(`USER UPDATED SUCESSFULLY  name is ==${name}...:)..`);
//             }
//             else{
//                 console.log(err)
//             }
//          })
//     })
// })

///update using patch request
app.patch('/api/update/:name',(req,res)=>{
    pool.getConnection((err,connection) => {
         if(err) throw err;
         const {name,course} = req.body;
        console.log(req.body.name)
         connection.query('UPDATE test SET COURSE=? WHERE name=?',[course,name],(err,rows)=>{
            connection.release() //return connection to pool
            if(!err)
            {
                res.send(`USER UPDATED SUCESSFULLY  name is ==${name}...:)..`);
            }
            else{
                console.log(err)
            }
         })
         console.log(req.body)
    })
})

app.listen(port,()=>{
    console.log(`Backend server is running at port ${port}`)
})