const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch(err => {
    //     res.status(400).send(err)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

//auth route
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
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
        const user = await User.findById(req.params.id)
        updates.forEach((update) => {
            return user[update] = req.body[update]
        })
        await user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) return res.status(404).send()

        res.send(user)

    } catch (err) {
        res.status(400).send(err)
    }
})
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) return res.status(404).send()

        res.send(user)

    } catch (err) {
        res.status(500).send(err)
    }
})
module.exports = router