"use strict";

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

try {
  mongoose.connect('mongodb://127.0.0.1:27017/test')
} catch (e) {
  console.error("MongoDB failed to connect", e)
  process.exit(1)
}

let ToDoListSchema = new mongoose.Schema([{checked: Boolean, text: String}])
let UserSchema = new mongoose.Schema({username: String, lists: {any: {type: mongoose.Schema.Types.ObjectId, ref: "ToDoList"}}})
let UserModel = new mongoose.model('User', UserSchema)
let ToDoListModel = new mongoose.model('ToDoList', ToDoListSchema)

router.get('/', (req, res) => {
  res.status(200).send('')
})

router.post('/save-list', (req, res) => {
  const list = req.body
  if (!list) {
    return res.status(400).json({error: "Missing"})
  }
  res.cookie('list', list, {httpOnly: true})
  res.status(200).json({message: "cookie sent"})
})

router.get('/get-list', (req, res) => {
  const list = req.cookies.list || [];
  res.status(200).json(list)
})

module.exports = router