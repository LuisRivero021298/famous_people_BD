const { Router } = require('express');
const router = Router();

router.get('/test', (req,res) => {
	res.json({"famous_holleywood" : {
		"name": "luis"
	}});
})

module.exports = router;