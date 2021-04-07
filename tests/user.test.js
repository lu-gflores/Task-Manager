const request = require('supertest')
const app = require('../src/app')

test('Should signup new user', async () => {
    await request(app).post('/users').send({
        name: 'Joesph',
        email: 'joe@example.com',
        password: 'testing1283'
    }).expect(201)
})