"use strict";

const express = require('express')
const router = express.Router()

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
  const list = req.cookies.list || {};
  res.status(200).json(list)
})

module.exports = router