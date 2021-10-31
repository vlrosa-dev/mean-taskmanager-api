const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { List, Task } = require('./db/models');

// Load Middleware
app.use(bodyParser.json());

// CORS Middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* ROUTE HANDLERS */


/* LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req,res) => {
    // Retornar um array da base de dados
    List.find({}).then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    })
});

/**
 * POST /lists
 * Purpose: Create List
 */
app.post('/lists', (req, res) => {
    // Cria uma nova lista e retorna essa lista para o usuário (Incluindo o ID)
    // A informação da lista será passada como uma resposta JSON
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })   
});

/**
 * PATCH /lists/:id
 * Purpose: Update List
 */
app.patch('/lists/:id', (req, res) => {
    // Atualizar um item especifico da lista (Incluindo ID por URL) e especificar novo valor
    List.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete List
 */
app.delete('/lists/:id', (req, res) => {
    // Deletar item especifico da lista (Incluindo ID por URL)
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc)
    });
});

/**
 * GET /lists/:listId/tasks 
 * Purpsose: Get all tasks in specific list
 */
app.get('/lists/:listId/tasks', (req, res) => {
    // Retornar todas as tarefas de uma lista especifica (listID)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    // Criar tarefa em uma lista especifica (listId)
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
})

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update task in specific list
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // Atualizar uma tarefa em lista especifica
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete task in specific list
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndDelete({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((taskRemovedDoc) => {
        res.send(taskRemovedDoc);
    });
});


app.listen(3000, () => {
    console.log("Server is listening on port 3000.");
});