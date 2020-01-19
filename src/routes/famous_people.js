'use strict'
const { Router } = require('express');
const router = Router();
const FamousPeopleController = require('../controllers/FamousPeopleController');
const Multipart = require('connect-multiparty');
const Md_upload = Multipart({ uploadDir: './src/upload/Famous_People'});

router.get('/famous_people/:last?', FamousPeopleController.getFamousPeople);
router.get('/famous_detail/:id', FamousPeopleController.getFamousPeopleById);
router.get('/famous_people/profession/:profession', FamousPeopleController.getFamousPeopleByProfession);
router.get('/famous_people/sex/:sex', FamousPeopleController.getFamousPeopleBySex);
router.get('/famous_people/name/:name', FamousPeopleController.getFamousPeopleByName);
router.get('/get-image/:image', FamousPeopleController.getImage);

router.post('/save', FamousPeopleController.save);
router.post('/upload-image/:id?',  Md_upload, FamousPeopleController.upload);  

router.put('/famous_people/:id', FamousPeopleController.update);

router.delete('/famous_people/:id', FamousPeopleController.delete);
module.exports = router;