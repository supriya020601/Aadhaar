//create mini express application
const exp=require("express")
const userApi=exp.Router();
const expressErrorHandler=require("express-async-handler")

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



userApi.get("/getaadhaar",expressErrorHandler(async (req,res,next)=>{
    let aadhaarCollectionObj = req.app.get("userAddressCollectionObject")
    //get userObj
   
   
    //search for existing user
    let user=await aadhaarCollectionObj.findOne();
    //if user existed


     //checking minor spelling mistakes
     function checkSpell(a,b){
        if(a.length===b.length && a!=null && b!=null){
            let cnt=0;
            for(let i=0;i<a.length;i++){
                if(a[i]!=b[i]){
                    cnt=cnt+1;
                    if(cnt>1){
                        break;
                    }
                }
            }
            return cnt;
        }
    }
   
    if(user!=null){

        user.Village=user.Village.toLowerCase()
        user.Subdistrict=user.Subdistrict.toLowerCase()
        user.District=user.District.toLowerCase()
        user.Street=user.Street.toLowerCase()
        user.Area=user.Area.toLowerCase()
        user.Hno=user.Hno.toLowerCase()
        user.Landmark=user.Landmark.toLowerCase()


        if(user.Hno==="null"){
            user.Hno="";
        }
        if(user.Street==="null"){
            user.Street="";
        }
        if(user.Landmark==="null"){
            user.Landmark="";
        }
        if(user.Area==="null"){
            user.Area="";
        }
        

        let village=user.Village.replace(/[^a-zA-Z ]/g,"");
        let subdistrict=user.Subdistrict.replace(/[^a-zA-Z ]/g,"");
        let district=user.District.replace(/[^a-zA-Z ]/g,"");


        village=village.replace(/ /g,"");
        subdistrict=subdistrict.replace(/ /g,"");
        district=district.replace(/ /g,"");
        

        if( village===subdistrict && subdistrict===district){
            user.Subdistrict=null;
            user.District=null;
        }
        else if(village===subdistrict){
                user.Subdistrict=null;
                let err=checkSpell(village,district);
                if(err==1){
                    user.District=null;
                }
                
        }
        else if(district===subdistrict){
            user.District=null;
            let err=checkSpell(village,subdistrict);
                if(err==1){
                    user.Subdistrict=null;
                }
        }
        else if(district==village){
            user.District=null;
            let err=checkSpell(village,subdistrict);
                if(err==1){
                    user.Subdistrict=null;
                }

        }
        
        


        let street=user.Street.replace(/[^a-zA-Z ]/g,"");
        let area=user.Area.replace(/[^a-zA-Z ]/g,"");

        street=street.replace(/ /g,"");
        area=area.replace(/ /g,"");

        if(street===area){
            if(street===""){
                user.Area="";
                user.Street="";                  
            }
            else{
                user.Area=null;
            }
        }



        
        // console.log(user)
        res.send({message:user})
    }
    else{
        
        res.send({message:"NO ADDRESS FOUND"})
    }
}))








//export userApi
module.exports=userApi;