const mongoose=require('mongoose');
const Product=require('./models/product');
mongoose.connect('mongodb://localhost:27017/farmStand')
.then(()=>{
    console.log('MONGO CONNECTION OPEN');
})
.catch(err=>{
    console.log('ERROR!! WHILE OPENING THE MONGO');
})
//isolated file which is used to add data into the DB when we want
const seedProducts=[
{
    name:'Grapes',
    price:0.99,
    category:'fruit'
},
{
    name:'Orange',
    price:1.99,
    category:'fruit'
},
{
    name:'Chocolate whole milk',
    price:2.99,
    category:'dairy'
},
{
    name:'Organic celery',
    price:0.69,
    category:'vegetable'
},
{
    name:'Tomato',
    price:1.25,
    category:'vegetable'
}
];
Product.insertMany(seedProducts)
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})