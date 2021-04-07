const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')


const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Dominic',
    email: 'dom@example.com',
    password: '1234hello',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}
//removes all users 
beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Joesph',
        email: 'joe@example.com',
        password: 'testing1283'
    }).expect(201)
    //assert the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    //assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Joesph',
            email: 'joe@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('testing1283')
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should NOT login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'randomwordhere'
    }).expect(400)
})

test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should NOT get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})
test('should NOT delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'John'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('John')
})
test('shoud NOT update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Los Angeles'
        })
        .expect(400)

})