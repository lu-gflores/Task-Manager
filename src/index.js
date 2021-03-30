const express = require('express')
require('./db/mongoose')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

//parses incoming json to an object 
app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.status(200).send(user)
    }).catch(err => {
        res.status(400).send(err)
    })
})
app.listen(port, () => {
    console.log('listening on Port: ' + port)
})