const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
const app = express();
const port = 3000

// to use the req.body we have to use the middleware and the below code is middleware
app.use(express.json())

// // Available routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use('/api/auth',require('./routes/auth.js'));
app.use('/api/notes',require('./routes/notes'));




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})