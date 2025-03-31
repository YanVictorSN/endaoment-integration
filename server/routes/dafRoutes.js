const express = require('express');
const router = express.Router();
const { createDaf, getDafs, getWireInstructions, wireDonation, grant } = require('./../controllers/dafRoutes.js');
const multer = require('multer');
const upload = multer();

router.post('/create-daf', upload.none(), createDaf);
router.post('/wire-donation',  upload.none(), wireDonation);
router.get('/get-dafs', getDafs);
router.get('/get-wire-instructions', getWireInstructions);
router.post('/grant', upload.none(), grant);


module.exports = router;