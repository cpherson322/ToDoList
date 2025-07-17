const express = require('express')
const cookieParser = require('cookie-parser')
const webapp = express()
const port = 39640

webapp.use(cookieParser())

users = {
        "abc123": {"List1": "ListData"}
}

webapp.get('/', (req, res) => {
  let sessionID = "abc123"
  res.cookie("sessionID", sessionID, {httpOnly: true})
  res.send("Cookie sent!")

  user = users[sessionID]
  if (!user) {
        res.status(401).json({error: "Invalid session"})
  }
})

webapp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})