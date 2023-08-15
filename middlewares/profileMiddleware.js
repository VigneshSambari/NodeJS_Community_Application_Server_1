const cloudinary = require ('cloudinary').v2;;
const fs = require('fs');

const uploadProfileMedia = async (req, res, next) => {
    console.log("inside uploadprofilemedia middleware");
    console.log(req.body);
    try{
        const {userId} = req.body;
        const files = req.files;
        var uploadedCoverPic ,uploadedProfilePic;
        for(var file of files){
            console.log(file);
            if(file.originalname=='coverPic'){
                const coverPicPath=file.path;
               uploadedCoverPic = await cloudinary.uploader.upload(coverPicPath,
                    {
                        resource_type: "auto",
                        folder: `communityapplication/profile/${userId}`,
                    }
                );
                
                // req.body.coverPic={
                //     secureUrl:uploadedCoverPic.secure_url,
                //     publicId:uploadedCoverPic.public_id
                // }
               console.log(uploadedCoverPic.secure_url);
               console.log("uploaded cover pic")
            }
            if(file.originalname=='profilePic'){
                const profilePicPath= file.path;
 
 
 
                 uploadedProfilePic = await cloudinary.uploader.upload(profilePicPath,
                    {
                        resource_type: "auto",
                        folder: `communityapplication/profile/${userId}`,
                    }
                );
                
                // req.body.profilePic={
                //     secureUrl: uploadedProfilePic.secure_url,
                //     publicId: uploadedProfilePic.public_id
                // };
                console.log(uploadedProfilePic.secure_url);
                console.log("uploaded cover pic")
            }
        };
        console.log(req.body);
        return res.status(200).json({uploadedProfilePic,uploadedCoverPic})
        next();
    }
    catch(err){
        console.log("Error in Profile media");
        console.log(err);
        res.status(400).json({"_message":"Error in uploading profile media!"});
    }
 
          
}





const deleteProfileMedia = async (req, res, next) => {
    console.log("inside deleteBlogMedia middleware");
    try{
        const {deletePublicIds} = req.body;
        if(deletePublicIds.length == 0){
            next();
        }
        
        console.log(deletePublicIds);
        for(var i=0;i<deletePublicIds.length;i++){
            await cloudinary.uploader.destroy(deletePublicIds[i]);
        }
        
        console.log("Successfully deleted images from cloudinary")
        next();
    }
    catch(err){
        console.log("Error in deleting image middleware");
        res.json(err);
    }

}

module.exports= {
    deleteProfileMedia,
    uploadProfileMedia
}