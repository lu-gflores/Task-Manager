//CRUD operations
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
const { MongoClient, ObjectID } = require('mongodb')


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log('Unable to connect to database.')

    const db = client.db(databaseName)
    // db.collection('users').deleteMany({ age: 22 })
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))

    db.collection('tasks').deleteOne({ description: 'Start on Python project' })
        .then(res => console.log(res))
        .catch(err => console.log(err))

})