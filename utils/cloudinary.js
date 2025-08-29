import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv" ; 
import { config } from 'dotenv';
import fs from 'fs' ;

dotenv.config({
    path: './.env' 
})




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key:  process.env.API_KEY, 
        api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    console.log(cloudinary.config)
        const uploadOnCloudianry = async function(localpath){
            console.log(localpath) ; 
            try{
                if(!localpath){
                    console.log("localpath not found") ; 
                    return null ; 
                }
                const uploadResult = await cloudinary.uploader.upload(localpath , {
                    public_id : "sds" ,
                    resource_type : 'auto' ,
                })
                console.log(`cloudianry upload successfully ${uploadResult.url}`) ; 
                return uploadResult  ;
            }
            catch(error){
                console.log(`cloudinary upload failed ${error.message}`) ; 
                if(fs.existsSync(localpath)){
                    fs.unlinkSync(localpath);
                }
                return -1 ;
            }

        }
    
        export default uploadOnCloudianry ; 
    