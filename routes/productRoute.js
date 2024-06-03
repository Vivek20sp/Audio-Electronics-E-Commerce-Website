import express from 'express';
import multer from 'multer';
import cloudnerry from '../Cloudnerry/cloudnerry.js';
import Product from '../model/ProductModel.js';
import fs from 'fs';
import { validationResult, body } from 'express-validator';

const router = express.Router();

const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const upload = "./UploadFolder";
        fs.mkdirSync(upload, { recursive: true });
        cb(null, upload);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: Storage }).array("files", 5);

router.get('/getAllImages', async (req, res) => {
    try {
        const response = await Product.find({});
        res.status(200).send({ response });
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
});

router.post('/createNewProduct', [
    body('id').isNumeric().isEmpty().withMessage('Enter A Valid ID'),
    body('name').isLength(2).isEmpty().withMessage('Enter A Valid Name'),
    body('image').isEmpty().withMessage('Enter A Valid Image'),
    body('description').isLength(10).withMessage('Enter A Valid Description'),
    body('features').isLength(10).withMessage('Enter A Valid Features'),
    body('price').isNumeric().isEmpty().withMessage('Enter A Valid Price'),
], async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error("Multer error:", err);
            return res.status(500).json({ error: "Error uploading files" });
        } else if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "Unknown error" });
        }

        try {
            const files = req.files;

            if (!files || files.length == 0) {
                return res.status(400).send({ error: "Files are required" });
            }

            const imagesURL = [];

            for (let file of files) {
                const localFilePath = file.path;
                const response = await cloudnerry(localFilePath);
                imagesURL.push(response.secure_url);
            }

            const imageUpload = new Product({
                id:req.body.id,
                name:req.body.name,
                image:imagesURL,
                description:req.body.description,
                features:req.body.features,
                price:req.body.price,
            });

            await imageUpload.save();

            res.status(200).send({ imageUpload });
        } catch (error) {
            console.log(error.message);
            res.status(400).send({ error: error.message });
        }
    });
});

router.get('/getSpecificProduct/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        const item = await Product.findById(id);
        res.status(200).send({item});
        console.log(item);
    } catch (error) {
        console.log(error.message);
        res.status(400).send({error:error.message})
    }
})

export default router;