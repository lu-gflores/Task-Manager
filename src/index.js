const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

//parses incoming json to an object 
app.use(express.json())

//routers
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('listening on Port: ' + port)
})

const bcrypt = require('bcryptjs')

const myfunction = async () => {
    const password = 'Red123456!'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare(password, hashedPassword)
    console.log(isMatch)
}
myfunction()

