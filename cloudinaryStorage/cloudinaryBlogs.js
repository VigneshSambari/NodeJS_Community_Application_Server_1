const cloudinary = require('cloudinary').v2;
const config = require('config');

cloudinary.config({
    cloud_name: config.get("CloudinaryCloudNameForBlogs"),
    api_key: config.get("CloudinaryAPIKeyForBlogs"),
    api_secret: config.get("CloudinaryAPISecretForBlogs")
  });

module.exports = cloudinary;