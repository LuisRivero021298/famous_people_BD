'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const ConfigurationsSchema = Schema({ //Estructura del modelo
    theme_color: String
});

module.exports = Mongoose.model('Configurations', ConfigurationsSchema); //parametros = nombreModelo, Estructura