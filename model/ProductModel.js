import mongoose from "mongoose";

const ProductModel = mongoose.Schema({
    id:{
        type:Number,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    image:[
        {
            type:String,
            data:String,
            require:true,
        }
    ],
    description:{
        type:String,
        require:true,
    },
    features:{
        type:String,
        require:true,
    },
    price:{
        type:String,
        require:true,
    },
});

const Product = mongoose.model('ProductAPI',ProductModel);

export default Product;