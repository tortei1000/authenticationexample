const bcrypt = require('bcryptjs')


module.exports = {
  register: async (req, res) => {
    const db = req.app.get('db')
    const { name, email, password } = req.body

    let users = await db.get_user_by_email(email) //user passes in email to db to check
    let user = users[0]

    if(user) {
      return res.status(409).send(`email in use`) //checks to see if user exists by email
    }
    
    const salt = bcrypt.genSaltSync(10)  //this gets the password adds a salt to it and hashes
    const hash = bcrypt.hashSync(password, salt)

    let response = await db.create_user({name, email, hash})
    let createdUser = response[0]  //the response from the server is an array so we look at index 0

    delete createdUser.password //deletes the password info from server not db

    req.session.user = createdUser //puts the createdUser in session.user this is an object

    res.send(req.session.user)

  },

  login: async (req, res) => {
    const db = req.app.get('db')
    const { name, email, password } = req.body

    let users = await db.get_user_by_email(email)
    let user = users[0]

    if(!user){ //checks to see if user is in db
      return res.status(401).send(`email or password incorrect`) 
    }
    let isAuthenticated = bcrypt.compareSync(password, user.password)
    if(!isAuthenticated){ //checks to see if password matches
      return res.status(401).send(`email or password incorrect`)

    }

    delete user.password
    req.session.user = user //user in db and password match so we add to session
    res.send(req.session.user)

  },

  logout: (req, res) => {
    req.session.destroy()
    res.sendStatus(200)

  }
}