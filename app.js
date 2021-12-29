const express=require("express");
const app=express();
const port=process.env.PORT || 8081;
const bodyParser=require("body-parser");
const cors=require("cors");
require('dotenv').config();
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
// app.use('/profile', express.static('upload/images'));
app.use('/uploads', express.static('uploads'));
require('./src/database/mongo');
// require('./src/version/v1')
// app.use(require('./src/middleware/auth'))
app.use(require('./src/routes/route'));
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})