const express = require('express')
const Route = express.Router()

const controller = require('../controllers/note')

Route
    //GET
    .get('/notes', controller.getNotes)
    .get('/notes/:id', controller.getNotesById)
    .get('/category', controller.getCategory)

    //POST
    .post('/notes/', controller.addNote)
    .post('/category/', controller.addCategory)

    //PATCH
    .patch('/notes/:id', controller.patchNote)
    .patch('/category/:id', controller.patchCategory)

    //DELETE
    .delete('/notes/:id', controller.deleteNote)
    .delete('/category/:id', controller.deleteCategory)

module.exports = Route