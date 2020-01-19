'use strict'
const FamousPeople = require('../models/FamousPeople.js');
const validator = require('validator');
const fs = require('fs');
const Path = require('path');

var selectProfession = (profession) => { //Select the profession
	switch (profession) {
		case 'actors':
			return ['actor','actress'];
			break;
		case 'singers':
			return ['singer'];
			break;
		case 'scientists':
			return ['scientific'];
			break;
		case 'athletes':
			return ['athlete'];
			break;
		case 'businessmen':
			return ['businessman', 'businesswoman'];
			break;
		default: 
			return false;
			break;
	}	
}; //end selectProfession
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
	save: (req, res) => {
		let body = req.body;
		console.log(body);
		try {
			var validateAll = {
				validateFirst: !validator.isEmpty(body.first_name),
				validateLast: !validator.isEmpty(body.last_name),
				validateBirth: !validator.isEmpty(body.year_of_birth),
				validateSex: !validator.isEmpty(body.sex),
				validateProf: !validator.isEmpty(body.profession)
			}
        } catch (error) {
			return  responseJson(res, 500, 'Error, missing data to send');
        }
		
		if(validateAll){
            let fp = new FamousPeople();
            
            fp.first_name = body.first_name;
            fp.last_name = body.last_name;
			fp.year_of_birth = body.year_of_birth;
            fp.sex = body.sex;
			fp.profession = body.profession;
			
            if (body.img) {
                fp.img = body.img;
            } else {
                fp.img = null;
            }
            
            fp.save((err, famousPeopleStored) => {
                if(err || !famousPeopleStored){
					return  responseJson(res, 404, 'Error, Not created');
                }
				return  responseJson(res, 200, 'Created',famousPeopleStored);
            });
        }else{
			return  responseJson(res, 404, 'It has not been validated');
        }
	}, //end save
	upload: (req, res) => {
        let id = req.params.id;
        let fileName = 'imagen no subida';
        let filePath = '';
        let fileSplit = '';
        let fileExt = '';

        if(!req.files){
        	return  responseJson(res, 404, 'Error, '+fileName);
        }

        //get file name and extension
        filePath = req.files.file0.path;
        fileSplit = filePath.split('/');
        console.log('HOLAAAAAAAAAAAAAAAAAA', fileSplit);    
        fileName = fileSplit[3];
        fileExt = fileName.split('\.')[1];
        
        
        //check extension
        if (fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'gif') {
            //borrar archivo subido
            fs.unlink(filePath, (err) => {
            	return  responseJson(res, 500, 'Error, invalid file extension');
            });
        } else {
            //si todo es valido sacando el id de la url
            if (id) {
                FamousPeople.findByIdAndUpdate({_id: id}, {img: fileName}, {new: true}, 
                (err, famousUpdated)=>{
                    if(err || !famousUpdated) {
                    	return  responseJson(res, 404, 'Error, error saving image');
                    }
                    return  responseJson(res, 200, 'Image uploaded', famousUpdated);
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    image: fileName
                }) 
            }
        }
    },//end upload 
	update: (req, res) => {
        let famousId = req.params.id;
        let data = req.body;
        console.log(data);

        try {
        	var validateAll = {
        		validateFirst: !validator.isEmpty(data.first_name),
				validateLast: !validator.isEmpty(data.last_name),
				validateBirth: !validator.isEmpty(data.year_of_birth),
				validateSex: !validator.isEmpty(data.sex),
				validateProf: !validator.isEmpty(data.profession)
        	}
        } catch (error) {
            return  responseJson(res, 500, 'Error, missing data to send');
        }

        if(validateAll){
            FamousPeople.findOneAndUpdate({_id: famousId}, data, {new: true}, 
            (err, famousUpdated) => {
                if(err){
                    return  responseJson(res, 404, 'Error, update failed');
                }
                if(!famousUpdated || famousUpdated.length <= 0){
                    return  responseJson(res, 404, "Error, the famous doesn't exists");
                }
                responseJson(res, 200, 'Famous updated', famousUpdated);
            });
        }else{
            return  responseJson(res, 404, "Error, the validation is not correct");
        }
    },//end update
	getFamousPeople: (req, res) => {
		let last = req.params.last;
		let query = FamousPeople.find({});
		
		if(last || last != undefined ){
			last = parseInt(last,10);
			query.limit(last);
		}
		
		query.sort('-_id').exec((err, famouspeoples) =>{
            if(err || !famouspeoples || famouspeoples.length <= 0){
				return  responseJson(res, 404, 'Error, Famous people have not been found');
            }
            
            return  responseJson(res, 200, 'Famous found', famouspeoples);
        });
    }, //end getFamousPeople
    getFamousPeopleById: (req, res) => {
        let id = req.params.id;

        if(!id || id == null){
            return  responseJson(res, 404, 'Specify the famous');
        }

        FamousPeople.findById(id, (err, famousDetail) => {
            if(err || !famousDetail){
                return  responseJson(res, 500, 'Famous does not exist');
            }
            return  responseJson(res, 200, '',famousDetail);
        });
    },
	getFamousPeopleByProfession: (req, res) => {
		let profession = req.params.profession;
		let famousPeopleByProfession = [];
		
		if(!profession || profession == null){		
			return  responseJson(res, 404, 'Specify the profession');
		}

		famousPeopleByProfession = selectProfession(profession);
		
		let query = FamousPeople.find({profession: famousPeopleByProfession});
		query.exec((err, famouspeoples) =>{
            if(err || !famouspeoples || famouspeoples.length <= 0){
				return  responseJson(res, 404, 'There is no one registered with this profession');
            }
            
            return  responseJson(res, 200, 'the profession has been found', famouspeoples);
        });
	},//end getFamousPeopleByProfession
	getFamousPeopleBySex: (req, res) => {
		let sex = req.params.sex;
		
		if(!sex || sex == null){
			return  responseJson(res, 404, 'Specify the sex');
		}
		
		let query = FamousPeople.find({sex: sex});
		
		query.exec((err, famouspeoples) =>{
            if(err || !famouspeoples || famouspeoples.length <= 0){
				return  responseJson(res, 404, 'This sex not exists');
            }
            
            return  responseJson(res, 200, 'The sex has been found', famouspeoples);
        });
	},//end getFamousPeopleBySex
	getFamousPeopleByName: (req, res) => {
		let name = req.params.name;
		
		if(!name || name == null){
			return  responseJson(res, 404, 'Specify the name');
		}
        FamousPeople.find({ 
            "$or" : [
                { "first_name" : {"$regex" : name, "$options" : "i"}},
                { "last_name" : {"$regex" : name, "$options" : "i"}}
            ]   
        })
        .sort([['date', 'descending']])
        .exec((err, famouspeoples) => {
            if(err){
                return  responseJson(res, 500, 'Error in the server');
            }
            if(!famouspeoples || famouspeoples.length <= 0){
                return  responseJson(res, 404, 'This name not exists');
            }
            return  responseJson(res, 200, 'The name has been found', famouspeoples);
        });
	},// end getFamousPeopleByName
	getImage: (req, res) => {
		let image = req.params.image;
		let pathFile = './src/upload/Famous_People/' + image;
		
		fs.exists(pathFile, (exists) => {
            if(!exists){
                return res.status(404).send({
                    status: 'error',
                    message: "this image path doesn't exist"
                });
            }
            return res.sendFile(Path.resolve(pathFile)); //devuelve la imagen
        });
	}, //end getImage
	delete: (req, res) => {
		let id = req.params.id;

        FamousPeople.findOneAndDelete({_id: id},
        (err, famousRemove) => {
            if(err){
            	return  responseJson(res, 500, 'Error: '+err);
            }
            if(!famousRemove || famousRemove.length <= 0){
            	return  responseJson(res, 404, 'Error, delete failed');
            }
            return  responseJson(res, 200, 'Delete Famous', famousRemove);
        });
	}// end delete
};

module.exports = Controller;