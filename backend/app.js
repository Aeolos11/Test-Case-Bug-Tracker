const express = require('express');
const app = express();
const port = 3000;

const dotenv = require('dotenv')
dotenv.config();

require('./config/db')
const health = require('./routes/health')




app.use('/api', health);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});