const express = require('express');
const cors = require('cors');

const app = express();

//Config JSON
app.use(express.json());

//Public Folder for images
app.use(express.static('public'));

//Solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//Routes
const UserRouter = require('./routes/UserRouter');
app.use('/users', UserRouter);

const DonationRouter = require('./routes/DonationRouter');
app.use('/donations', DonationRouter);

app.listen(5000);
