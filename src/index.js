const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

//express middleware
// // app.use((req, res, next) => {
// //     if (req.method === 'GET') {
// //         res.send('get requests are disabled')
// //     } else {
// //         next()
// //     }
// // })
// app.use((req, res, next) => {
//     res.status(503).send('Site under maintaince')
// })


//parses incoming json to an object 
app.use(express.json())

//routers
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('listening on Port: ' + port)
})

// const jwt = require('jsonwebtoken')

// const myfunction = async () => {
//     const token = jwt.sign({ _id: 'abc1234' }, 'mysecretword', { expiresIn: '7 days' })
//     console.log(token)

//     const data = jwt.verify(token, 'mysecretword')
//     console.log(data)
// }
// myfunction()

