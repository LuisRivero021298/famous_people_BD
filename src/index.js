'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/famous_people', 
				{ useUnifiedTopology: true, useNewUrlParser: true })
		.then(()=> {
			console.log('Conectado a BD');

			//create server 
			app.listen(port,() => {
				console.log('servidor creado corriendo en http://localhost:'+port);
			});
		});//connect to BD
