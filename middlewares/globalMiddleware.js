const cloudinary = require ('cloudinary').v2;
const fs = require('fs');

const uploadMedia = async (req, res, next) => {
    console.log("inside uploadBlogMedia middleware");
    try{
        const {postedBy,folderName} = req.body;
        
        const files = req.files;
        console.log(files);
        
        var fileData =[];
        for(const file of files){
            const {path} = file;
            const uploadedFileDetails = await cloudinary.uploader.upload(path,
                {
                    resource_type: "auto",
                    folder: `communityapplication/blogs/${folderName}`,
                }
            );
                fileData.push({
                    secure_url: uploadedFileDetails.secure_url,
                    public_id: uploadedFileDetails.public_id
                });
            fs.unlinkSync(path);
        }

        console.log("Uploaded all images")
        console.log(fileData)
        return res.status(200).json(fileData);
    }
    catch(err){
        console.log("Error in uploading media blog middleware");
        res.status(400).json({
            "_message": "Error uploading files!",
        });
    }
 
          
}



const deleteMedia = async (req, res, next) => {
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
        
        return res.status(200).json();
    }
    catch(err){
        console.log("Error in deleting image middleware");
        return res.ststus(400).json(err);
    }

}

module.exports= {
    uploadMedia,
    deleteMedia
}