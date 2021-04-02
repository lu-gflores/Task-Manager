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

// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     // const task = await Task.findById('60673c8be8921974d051b111')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('60673b9424413b9d188df6f0')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }
// main()