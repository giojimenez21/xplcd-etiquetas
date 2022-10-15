const express = require('express');
const { router } = require('./routers/index.router');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;


app.set('view engine', 'pug');

app.use(express.json());

app.use('/public',express.static('public'));
app.use('/labels', express.static('labels'))

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Listening: http://localhost:${PORT}`);
})