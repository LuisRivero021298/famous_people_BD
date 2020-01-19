'use strict'

//Load Modules
const express = require('express');
const morgan = require('morgan');

//execute express (http)
const app = express();

//load routes
const routeFP = require('./routes/famous_people');
const routeConf = require('./routes/routes');

//load middelwares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//add prefixes to routes
app.use('/api', routeFP);
app.use('/api', routeConf);

//export module 
module.exports = app;
