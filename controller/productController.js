import express from "express";
import bodyParser from "body-parser";
import { Products } from "../model/products.js";
import { verifyAToken } from "../middleware/Authenticate.js";


const productRouter =  express.Router()
productRouter.use(bodyParser.json())

productRouter.get('/', verifyAToken, (req,res)=>{
    Products.fetchProducts(req,res)
})

productRouter.get('/recent', verifyAToken, (req,res)=>{
    Products.recentProducts(req,res)
})

productRouter.get('/:id', (req,res)=>{
    Products.fetchProduct(req,res)
})

productRouter.post('/add', verifyAToken, (req,res)=>{
    Products.addProducts(req,res)
})

productRouter.patch('/:id', verifyAToken, (req,res)=>{
    Products.updateProducts(req,res)
})

productRouter.delete('/:id', verifyAToken,(req,res)=>{
    Products.deleteProduct(req,res)
})

export{
    
    productRouter
}