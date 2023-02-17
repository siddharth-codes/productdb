const express=require('express');
const path=require('path');
const mongoose = require('mongoose');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash')
const Farm=require('./models/farm')

mongoose.connect('mongodb://mongo_db:27017/farmStandtake2')
.then(()=>{
    console.log('MONGO CONNECTION OPEN');
})
.catch(err=>{
    console.log('ERROR!! WHILE OPENING THE MONGO');
})
const app=express();
const Product=require('./models/product');
const { urlencoded } = require('express');
app.set('views',path.join(__dirname,'views'));

app.use(flash());
app.use(session({secret:'thisisnotagoodsecret',resave:false,saveUninitialized:false}))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use((req,res,next)=>{
    res.locals.messages=req.flash('success')
    next();
})

app.set('view engine','ejs');

//FARM ROUTES
app.get('/farms',async(req,res)=>{
    const allFarms=await Farm.find({});
    res.render('farms/index',{allFarms});
})
app.get('/farms/new',(req,res)=>{
    res.render('farms/new')
})
app.get('/farms/:id',async(req,res)=>{
    const {id}=req.params;
    const farm=await Farm.findById(id).populate('products');
    res.render('farms/show',{farm});
})
app.get('/farms/:id/products/new',async(req,res)=>{
    const {id}=req.params;
    const farm=await Farm.findById(id);
    res.render('products/new',{farm});
})
app.post('/farms',async (req,res)=>{
    const farm=new Farm(req.body);
    await farm.save();
    req.flash('success','Successfully made the farm');
    res.redirect('/farms');
})
app.post('/farms/:id/products',async(req,res)=>{
    const {id}=req.params;
    const farm= await Farm.findById(id);
    const {name,price,category}=req.body;
    const product=new Product({name,price,category});
    farm.products.push(product);
    product.farm=farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${farm._id}`);
})
app.delete('/farms/:id',async(req,res)=>{
    const farm=await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
})

//PRODUCT ROUTES
app.get('/products',async (req,res)=>{
    const {category}=req.query;
    if(category){
        const products = await Product.find({category:category});
        res.render('products/index',{products})
    }else{
        const products=await Product.find({});
        res.render('products/index',{products});
    }
    
})
app.post('/products',async (req,res)=>{
    const newProduct= new Product(req.body);
    await newProduct.save();
    res.redirect('/products')
})
app.get('/products/new',(req,res)=>{
    res.render('products/new')
})
app.get('/products/:id',async(req,res)=>{
    const {id}=req.params;
    const product=  await Product.findById(id).populate('farm','name');
    console.log(product);
    res.render('products/show',{product});
})
app.get('/products/:id/edit',async(req,res)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    res.render('products/edit',{product});
})
app.put('/products/:id',async(req,res)=>{
    const {id}=req.params;
    const product = await Product.findByIdAndUpdate(id,req.body,{runValidators:true});
    res.redirect(`/products/${id}`);
})
app.delete('/products/:id',async(req,res)=>{
    const {id}=req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})
app.listen(3000,()=>{
    console.log('STARTED TO LISTEN ON PORT 3000');
});