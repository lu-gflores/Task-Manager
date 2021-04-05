const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()
const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Avatar file must be a jpg, jpeg, or png format'))
        }
        cb(undefined, true)
    }
})

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

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

//auth route for user profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//update user profile that is logged in
router.patch('/users/me', auth, async (req, res) => {
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
        updates.forEach((update) => {
            return req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)

    } catch (err) {
        res.status(400).send(err)
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try {
        //mongoose method 
        await req.user.remove()

        res.send(req.user)

    } catch (err) {
        res.status(500).send(err)
    }
})
router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})

module.exports = router