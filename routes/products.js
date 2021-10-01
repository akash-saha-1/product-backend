const express = require("express");
const router = express.Router();
const User = require('./../models/User');
const Product = require('./../models/Product');
const multer = require('multer');
const path = require('path');

// file upload configuration
var baseDir = path.dirname(require.main.filename);
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/PNG': 'PNG',
  'image/JPG': 'JPG',
  'image/JPEG': 'JPG',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isvalid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image type');
    if (isvalid) uploadError = null;
    cb(uploadError, './uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split('.')[0] + '_' + Date.now();
    const extention = FILE_TYPE_MAP[file.mimetype];
    //cb(null, `${fileName}-${Date.now()}.${extention}`);
    cb(null, `${fileName}.${extention}`);
  },
});
const upload = multer({ storage: storage });

// get all products
router.get('/', async (req,res)=>{
    try{
        let products = await Product.find({});
        return res.send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send('Error Occured');
    }
});

router.post('/',upload.single('image'), async (req,res)=>{
    let product = req.body;
    const file = req.file;
    console.log(file);
    if (!file) return res.status(400).send('No image found in the request');

    const fileName = req.file.filename;
    const filePath = '/uploads/' + fileName;
    // date setting
    let date = new Date();
    let yesterday = new Date(date.getTime());
    yesterday.setDate(date.getDate() - 1);

    product.priceChanged = yesterday;
    product.image = filePath;
    try{
        let newProduct = await Product.create(product);
        return res.send({newProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send('Error Occured');
    }
});

router.put('/:id', async (req,res)=>{
    let id = req.params.id;
    let product = req.body;
    //product.priceChanged = new Date();
    if(req.body.price){
        try{
            let newProduct = await Product.findByIdAndUpdate({_id: id},{price: req.body.price, 
            priceChanged: new Date()},{
                new: true
            });
            return res.send({newProduct});
        }catch(err){
            console.error(err);
            return res.status(500).send('Error Occured');
        }
    }else{
        console.error(err);
        return res.status(500).send('Error Occured');
    }
});

router.delete('/:id', async function(req, res){
    let id = req.params.id;
    try{
        await Product.findByIdAndRemove(id);
        console.log('success');
        return res.status(200).send();
    }catch(err){
        console.error(err);
        return res.status(500).send('Error Occured');
    }
});

// sort by category
router.get('/category/:name', async function(req, res){
    let name = req.params.name;
    try{
        let products = await Product.find({category: name});
        return res.status(200).send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send('Error Occured');
    }
});

module.exports = router;