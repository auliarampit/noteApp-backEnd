const express = require('express')
const app = express()
const port = process.env.PORT || 2020
const bodyParser = require('body-parser')
const routes = require('./src/routes/route')



app.listen(port, ()=> {
    console.log('kita menggunakan port:' + port)
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', routes)