//create mini express application
const exp=require("express")
const userApi=exp.Router();
const expressErrorHandler=require("express-async-handler")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken");



//add body parser middleware
userApi.use(exp.json())



//create aadhaaruser using async and await method
userApi.post('/createaadhaar',expressErrorHandler(async (req,res,next)=>{
    let aadhaarCollectionObj = req.app.get("userAddressCollectionObject")
   
    let newUser=req.body;
   
    let user=await aadhaarCollectionObj.findOne({Aadhaar:newUser.Aadhaar})
   
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
   
    //search for existing user
    let user=await aadhaarCollectionObj.findOne({Aadhaar:newUser})
    //if user existed
   
    if(user!=null){

        user.Village=user.Village.toLowerCase()
        user.Subdistrict=user.Subdistrict.toLowerCase()
        user.District=user.District.toLowerCase()
        user.Street=user.Street.toLowerCase()
        user.Area=user.Area.toLowerCase()


        if( user.Village===user.Subdistrict && user.Subdistrict===user.District){
            user.Subdistrict=null;
            user.District=null;
        }
        else if(user.Village===user.Subdistrict){
                user.Subdistrict=null;
                
        }
        else if(user.District===user.Subdistrict){
            user.District=null;
        }


        let str=user.Street.replace(/[^a-zA-Z ]/g,"");
        let area=user.Area.replace(/[^a-zA-Z ]/g,"");

        str=str.replace(/ /g,"");
        area=area.replace(/ /g,"");

        if(str===area){
            if(str===""){
                user.Area=null;
                user.Street=null;                  
            }
            else{
                user.Area=null;
            }
        }

        
        console.log(user)
        res.send({message:user})
    }
    else{
        
        res.send({message:"user not existed"})
    }
}))


















//export userApi
module.exports=userApi;