//create mini express application
const exp=require("express")
const userApi=exp.Router();
const expressErrorHandler=require("express-async-handler")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")


//add body parser middleware
userApi.use(exp.json())









//get user by username using async and await
userApi.get('/getusers/:username',expressErrorHandler(async (req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    let un=req.params.username
    //search 
    let userObj=await userCollectionObj.findOne({username:un})
    if(userObj===null){
        res.send({message:"user not existed"})
    }
    else{
        res.send({message:userObj})
    }
}))



//create user using async and await method
userApi.post('/createuser',expressErrorHandler(async (req,res,next)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    //get userObj
    let newUser=req.body;
    //search for existing user
    let user=await userCollectionObj.findOne({username:newUser.username})
    //if user existed
    if(user!=null){
        res.send({message:"user already existed"})
    }
    else{
        //hash password
        let hashedPassword=await bcryptjs.hash(newUser.password,7)
        //replace password
        newUser.password=hashedPassword
        //insert
        await userCollectionObj.insertOne(newUser)
        res.send({message:"New user created successfully"})
    }
}))


//update user using async and await method
userApi.put('/updateuser/:username',expressErrorHandler(async (req,res,next)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    //get modified user
    let modifiedUser=req.body
    //update
    await userCollectionObj.updateOne({username:modifiedUser.username},{$set:{...modifiedUser}})
    res.send({message:"user modified successfully"})
}))

//delete user using async and await method
userApi.delete('/deleteuser/:username',expressErrorHandler(async (req,res,next)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    //get username from url
    let un=req.params.username
    let user=await userCollectionObj.findOne({username:un})
    if(user===null){
        res.send({message:"user not existed"})
    }
    else{
        await userCollectionObj.deleteOne({username:un})
        res.send({message:"user deleted successfully"})
    }
}))

//user login
userApi.post('/login',expressErrorHandler(async(req,res)=>{
    let userCollectionObj = req.app.get("userCollectionObj")
    //get user credentials
    let credentials=req.body;
    //search user by username
    let user=await userCollectionObj.findOne({username:credentials.username})
    //if user not found
    if(user===null){
        res.send({message:"Invalid username"})
    }
    else{
        //compare the password
        let result=await bcryptjs.compare(credentials.password,user.password)
        //if not matched
        if(result===false){
            res.send({message:"Invalid password"})
        }
        else{
            //create a token
            let signedToken=jwt.sign({username:credentials.username},'supriya',{expiresIn:120})
            //send a token to client
            res.send({message:"Logged in successfully", token: signedToken, username:credentials.username,userObj:user})
        }
    }
}))


//add to cart
userApi.post("/add-to-cart", expressErrorHandler(async (req, res, next) => {

    let userCartCollectionObject = req.app.get("userCartCollectionObject")

    let newProdObject = req.body;
    //find usercartcollection 
    let userCartObj = await userCartCollectionObject.findOne({username:newProdObject.username})

    //if userCartObj is not existed
    if(newProdObject.username===null){
        res.send({message:"Login required"})
    }
    else if (userCartObj === null) {
        
        //create new object
        let products = [];
        products.push(newProdObject.productObject)

        let newUserCartObject = { username:newProdObject.username, products }

        //insert it
        await userCartCollectionObject.insertOne(newUserCartObject)        
        let latestCartObj = await userCartCollectionObject.findOne({ username:newProdObject.username })
        res.send({ message: "New product Added", latestCartObj: latestCartObj })

    }
    //if existed
    else {
        //push productObject to products array
        userCartObj.products.push(newProdObject.productObject)
        //update document
        await userCartCollectionObject.updateOne({ username: newProdObject.username }, { $set: { ...userCartObj } })
        let latestCartObj = await userCartCollectionObject.findOne({ username: newProdObject.username })
        res.send({ message: "New song added to favourites", latestCartObj: latestCartObj })
    }

}))


//get products from user cart
userApi.get("/getproducts/:username", expressErrorHandler(async (req, res, next) => {

    let userCartCollectionObject = req.app.get("userCartCollectionObject")

    let un = req.params.username;

    let userProdObj = await userCartCollectionObject.findOne({ username: un })

    if (userProdObj === null) {
        res.send({ message: "Cart-empty" })
    }
    else {
        res.send({ message: userProdObj })
    }


}))



//dummy route to create protected resourse
userApi.get("/testing",(req,res)=>{
    res.send({message:"This is protected data"})
})


//export userApi
module.exports=userApi;