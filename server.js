// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
var pug = require('pug');
var bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);


app.set('view engine', 'pug');
app.set('views','./views');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.send('I love CodersX');
});
app.get('/todos',function(req,res){
  var q = req.query.q;
  if(q)
  var matchTodo = db.get('todos').value().filter(function(todo){
    return todo.text.toLowerCase().indexOf(q.toLowerCase())!==-1;
  })
  else
    matchTodo=db.get('todos').value();
  res.render('./todos.pug',{
    todos: matchTodo 
  })
})
app.get('/todos/:id/delete',function(req,res){
  var id = parseInt(req.params.id);
  var todo = db.get('todos').find({id: id}).value();
  res.render('./delete.pug',{
    todo:todo
  });
})
app.post('/todos/create',function(req,res){
  req.body.id = db.get('todos').value().length+1;
  req.body.text = req.body.todo;
  db.get('todos').push(req.body).write();
 res.redirect('back')
})
app.post('/todos/:id/delete',function(req,res){
  db.get('todos').remove({id: parseInt(req.params.id)}).write();
  res.redirect('/todos');
})
// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
