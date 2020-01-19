'use strict'
const Configurations = require('../models/Configurations.js');
const validator = require('validator');
const fs = require('fs');
const Path = require('path');


var responseJson = (res,status, message, data) => { // Server response
	if(status != 200){
		return res.status(status).json({
			status: 'error',
			message: message			
		});	
	}
	return res.status(status).json({
        status: 'success',
		data
	});
};//end responseJson

const Controller = {
	getConfigurations: (req, res) => {
		let query = Configurations.find({});
	
		query.sort('-_id').exec((err, configurations) =>{
            if(err || !configurations || configurations.length <= 0){
				return  responseJson(res, 404, 'Error');
            }
            
            return  responseJson(res, 200, 'Configurations found', configurations);
        });
	},
	saveConfigurations: (req, res) => {
		let body = req.body;

		try {
			var validateAll = {
				validateTheme: !validator.isEmpty(body.theme_color)
			}
        } catch (error) {
			return  responseJson(res, 500, 'Error, missing data to send');
        }

        if(validateAll){
            let conf = new Configurations();
            
            conf.theme_color = body.theme_color;
            
            conf.save((err, configurationsStored) => {
                if(err || !configurationsStored){
					return  responseJson(res, 404, 'Error, Not created');
                }
				return  responseJson(res, 200, 'Created',configurationsStored);
            });
        }else{
			return  responseJson(res, 404, 'It has not been validated');
        }
	},

	updateConfigurations: (req,res) => {
		console.log(req.body);
		let body = req.body;

		try {
			var validateAll = {
				validateTheme: !validator.isEmpty(body.theme_color)
			}
        } catch (error) {
			return  responseJson(res, 500, 'Error, missing data to send');
        }

        if(validateAll){
            let id = req.params.id;
            
            Configurations.findOneAndUpdate({_id: id}, body, {new: true}, 
            (err, confUpdated) => {
                if(err){
                    return  responseJson(res, 404, 'Error, update failed'+err);
                }
                if(!confUpdated || confUpdated.length <= 0){
                    return  responseJson(res, 404, "Error");
                }
                responseJson(res, 200, 'Configurations updated', confUpdated);
            });
        }else{
			return  responseJson(res, 404, 'It has not been validated');
        }
	}
}

module.exports = Controller;