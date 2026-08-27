const express = require('express');
const app = express();
const port = 3000;


const dotenv = require('dotenv')
dotenv.config();

app.use(express.json());

require('./config/db')
const health = require('./routes/health')
const auth = require('./routes/auth');
const project = require('./routes/project');




app.use('/api', health);
app.use('/api', auth);
app.use('/api', project);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});