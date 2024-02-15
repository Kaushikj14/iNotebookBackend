const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')


connectToMongo();
const app = express();
const port = 5000;



// to use the req.body we have to use the middleware and the below code is middleware
app.use(express.json())
app.use(cors())
// // Available routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use('/api/auth',require('./routes/auth.js'));
app.use('/api/notes',require('./routes/notes'));




app.listen(port, () => {
  console.log(`iNotebbok app listening on port ${port}`)
})