const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
//const dataFile = require('./datafile.json');
const jsonFile = require('jsonfile');
const app = express();

app.use(bodyParser.json());

//This data can be accessed with GET requests.  If it is modified via POST or DELETE requests, the updated version will be stored in dataFile.json
var dataStuff = [
    {
      todoItemId: 0,
      name: 'an item',
      priority: 3,
      completed: false
    },
    {
      todoItemId: 1,
      name: 'another item',
      priority: 2,
      completed: false
    },
    {
      todoItemId: 2,
      name: 'a done item',
      priority: 1,
      completed: true
    }
];
//Updates dataFile's contents. Upon server crash or restart the dataStuff array can be updated with the new file's contents
function updateFile(){
    jsonFile.writeFile('server/dataFile.json', dataStuff, function (err) {
        console.error(err)
    })
}


//GET to root route responds with random object
app.get('/',(req, res)=>{
    var genericObj = {
        Status:'ok'
    }
    res.send(genericObj);
    res.end('SUCCESS STATUS CODE: 200');
    console.log(res.statusCode);
})

//GET here responds with full JSON object
app.get('/api/TodoItems', (req,res)=>{
    res.send(dataStuff);
    console.log(res.statusCode);
});

//GET here responds with single toDo object
app.get('/api/TodoItems/:id', (req,res)=>{
    //Responds with a 'todo' object if ":id" matches a "todoItemId"
    if(req.params.id < dataStuff.length){
        for (let i=0; i<dataStuff.length; i++){
            if (req.params.id == dataStuff[i]["todoItemId"]){
                res.send(dataStuff[i]);
            }
        }
    }
    else {res.send('Error 404: File not found')}
    console.log(res.statusCode);
})

//POST here responds with request body
app.post('/api/TodoItems/', (req,res)=>{
    var newObj = req.body;
    let j = 0;//j will be a fail counter
    for (let i=0;i<dataStuff.length; i++){
        //If newObj's "todoItemId" matches existing "todoItemId" then newObj replaces that data object
        if (newObj["todoItemId"] == dataStuff[i]["todoItemId"]){
            dataStuff[i] = newObj;
        }
        else {j++}        
    }
    //If newObj's "todoItemId" didn't match existing "todoItemId" then it is added to array of data
    if (j == dataStuff.length){
        dataStuff.push(newObj);
    }
    res.status(201).send(newObj);
    console.log(dataStuff)
    updateFile();
});

//If the delete request params match any object's "todoItemId" value, that object is deleted.
app.delete('/api/TodoItems/:id', (req,res)=>{
    var delObj = req.params.id;
    for (let i=0; i<dataStuff.length; i++){
        if (delObj == dataStuff[i]["todoItemId"]){
            res.send(dataStuff[i]);
            dataStuff.splice(i, 1);
        }
    }
    console.log(dataStuff);
    updateFile();
});



module.exports = app;
