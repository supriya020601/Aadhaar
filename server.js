//create express application
const exp=require("express")
const app=exp();
const path=require("path")
//import mongoclient
const mc=require("mongodb").MongoClient;

//connect angular app with express server
app.use(exp.static(path.join(__dirname,"./dist/aadhar/")))

//connection string
const databaseurl="mongodb+srv://vnr2021:vnr2021@cluster0.m8rl3.mongodb.net/myfirstdb?retryWrites=true&w=majority"

//connect to db
mc.connect(databaseurl,{useNewUrlParser:true, useUnifiedTopology:true},(err,client)=>{
    if(err){
        console.log("error in database connection",err)
    }
    else{
        //get database object from client object
        let databaseObj=client.db("myfirstdb")
        //create user collection object
        let userAddressCollectionObject = databaseObj.collection("Aadhaar")
        app.set("userAddressCollectionObject",userAddressCollectionObject)
        console.log("connected to database successfully")
    }
})


//import APIs
const userApi=require("./APIs/aadhaarApi")

//execure specific api based on path
app.use('/user',userApi)

//error handling middleware
app.use((err,req,res,next)=>{
    res.send({message:`error is ${err.message}`})
})


//invalid path
app.use((req,res,next)=>{
    res.send({message:`path ${req.url} is invalid`})
})



//assign port
const port=4000
app.listen(port,()=>console.log(`server is listening on port ${port}`))