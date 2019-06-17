const express=require('express');
const app=express();
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
//Body-Parse
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

//also add process environment variable so as to not write the password manuaully
//add it in modemon.jason file
mongoose.connect('mongodb+srv://name:password@rest-4pnyl.mongodb.net/test?retryWrites=true&w=majority',{
  useNewUrlParser:true
})
.then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

// handling CROS errors
app.use((req,res,next) => {
  res.header("Acess-Control-Allow-Origin","*"),
  res.header("Acess-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization");

if (req.method == 'OPTIONS'){
  res.header('Access-Control-Allow-Method','PUT,POST,PATCH,DELETE,GET');
  return res.status(200).json({});
}
next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);


app.use((req,res,next) => {
  const error = new Error('Not Found');
  error.status=404;
  next(error);

});

app.use((error,req,res,next) => {

  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
});

module.exports=app;
