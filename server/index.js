require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')

const AuthCtrl = require('./controller/Auth')

let {PORT_NUMBER, CONNECTION_STRING, SESSION_SECRET} = process.env



massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log(`2- database connected`)
})

app.use(express.json())

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000* 60* 60*24*365
  }
}))


app.post('/auth/register', AuthCtrl.register)
app.post('/auth/login', AuthCtrl.login)
app.get('/auth/logout', AuthCtrl.logout)

app.listen(PORT_NUMBER, ()=>{
  console.log(`1- listing at ${PORT_NUMBER}`)
})

