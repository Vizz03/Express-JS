const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')


mongoose.connect("mongodb://localhost:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('open', () => {
    console.log('Connected to mongoDB');
});
db.on('error', (error) => {
    console.log(error)
})

const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let todoModel = require('./todo_schema')

//Creating Todos

app.post('/todo/add', (req,res) =>{
    let newTodo = new todoModel;
    newTodo.title = req.body.todo;
    newTodo.completed = false;

    newTodo.save((err) =>{
        if(err){
    res.send("error on adding Todo");
}else{
    res.send("Todo added")
} 
})
} )

//Fetching Todos

//Completed

app.get('/todo/completed', (req,res) => {
    todoModel.find({completed: true}, (err, todos) =>{
        if(err){
            res.send("error fetching todos");
        }else{
            res.json(todos)
        }
    })
})

//Unconpleted

app.get('/todo/uncompleted', (req,res) =>{
    todoModel.find({completed: false}, (err, todos)=>{
        if(err){
            res.send("error fetching todos");
        }else{
            res.json(todos)
        }
    })
})

//Updating a Todo

app.post('/todo/complete/:id',(req, res) => {
    todoModel.findByIdAndUpdate(req.params.id, {completed: true}, (err, todo) =>{
      if(!err){
        res.send("Completed !!");
      }
    })
  })

//Deleting a Todo
app.delete('/todo/:id', (req, res) => {
    let query = { _id: req.params.id }
    todoModel.deleteOne(query, (err) => {
      if(err){
        res.send("Error while deleting todo")
      }else{
        res.send("Todo deleted")
      }
    })
  })


app.listen(port, () => {
 console.log(`Server started on port http://localhost:${port}`)
})
