const mongoose=require("mongoose");
// const database_url=process.env.local_DATABASE_URL;
// console.log(database_url);
const database_url=process.env.DATABASE_URL;
// console.log(database_url);
mongoose.connect(database_url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Mongo Server Connected successfully...!!!");
},
(err)=>{
    console.error("failed to connect to mongodb",err.message);
});