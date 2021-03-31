const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const { update } = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

//parses incoming json to an object 
app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch(err => {
    //     res.status(400).send(err)
    // })
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(500).send()
    }
    // User.find({}).then(users => {
    //     res.status(200).send(users)
    // }).catch(err => {
    //     res.status(500).send()
    // })
})
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        //if there is no user by that id, send 404
        if (!user) return res.status(404).send()

        res.send(user)
    } catch (err) {
        res.send(500).send()
    }
    // User.findById(_id).then(user => {
    //     if (!user) return res.status(404).send()

    //     res.send(user)
    // }).catch(err => {
    //     res.status(500).send()
    // })
})

app.patch('/users/:id', async (req, res) => {
    //converts the request body properties as an array
    const updates = Object.keys(req.body)
    //properties that are allowed to be updated
    const allowedUpdates = ['name', 'email', 'password', 'age']

    //checks if the properies passed by the user are in the allowedUpdates array
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({ error: 'invalid update' })
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) return res.status(404).send()

        res.send(user)

    } catch (err) {
        res.status(400).send(err)
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        res.status(200).send(task)
    } catch (err) {
        res.status(404).send(err)
    }
})

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every(update => {
        return allowedUpdates.includes(update)
    })

    if (!isValid) return res.status(400).send({ error: 'invalid update' })

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (err) {
        res.status(404).send(err)
    }
})



app.listen(port, () => {
    console.log('listening on Port: ' + port)
})