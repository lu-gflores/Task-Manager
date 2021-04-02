const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        //copies all properties from body to object
        ...req.body,
        //addes on the owner property
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id })
        res.status(200).send(tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.status(200).send(task)
    } catch (err) {
        res.status(404).send(err)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every(update => {
        return allowedUpdates.includes(update)
    })

    if (!isValid) return res.status(400).send({ error: 'invalid update' })

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) return res.status(404).send()

        updates.forEach(update => {
            return task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(404).send(err)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router