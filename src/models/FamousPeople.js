'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const FamousPeopleSchema = Schema({ //Estructura del modelo
    first_name: String,
    last_name: String,
    year_of_birth: String,
    sex: String,
    profession: String,
    img: String
});

module.exports = Mongoose.model('FamousPeople', FamousPeopleSchema); //parametros = nombreModelo, Estructura