//create mini express application
const exp=require("express")
const userApi=exp.Router();
const expressErrorHandler=require("express-async-handler")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")


//add body parser middleware
userApi.use(exp.json())



//create aadhaaruser using async and await method
userApi.post('/createaadhaar',expressErrorHandler(async (req,res,next)=>{
    let aadhaarCollectionObj = req.app.get("userAddressCollectionObject")
    //get userObj
    let newUser=req.body;
    //search for existing user
    let user=await aadhaarCollectionObj.findOne({Aadhaar:newUser.Aadhaar})
    //if user existed
    if(user!=null){
        res.send({message:"user already existed"})
    }
    else{
        await  aadhaarCollectionObj.insertOne(newUser)
        res.send({message:"New user created successfully"})
    }
}))



userApi.get("/getaadhaar/:obj",expressErrorHandler(async (req,res,next)=>{
    let aadhaarCollectionObj = req.app.get("userAddressCollectionObject")
    //get userObj
   let newUser=req.params.obj;
    console.log(newUser)
    //search for existing user
    let user=await aadhaarCollectionObj.findOne({Aadhaar:newUser})
    //if user existed
    console.log(user)
    if(user!=null){

        if(user.Village.toLowerCase()===user.Subdistrict.toLowerCase() && user.Subdistrict.toLowerCase()===user.District.toLowerCase()){
            user.Subdistrict=null;
            user.District=null;
        }
        else if(user.Village.toLowerCase()===user.Subdistrict.toLowerCase()){
                user.Subdistrict=null;
                
        }
        else if(user.District.toLowerCase()===user.Subdistrict.toLowerCase()){
            user.District=null;
        }


        
        console.log(user)
        res.send({message:user})
    }
    else{
        
        res.send({message:"user not existed"})
    }
}))















//dummy route to create protected resourse
userApi.get("/testing",(req,res)=>{
    res.send({message:"This is protected data"})
})


//export userApi
module.exports=userApi;