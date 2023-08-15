const Message = require('../models/Message.model');

const requestNew = {
    new: true,
}


//create message from model
const createMessage = async (req, res, next) => {
    try{
        const {
            sentBy,
            sentTo,
            type,
            content,
        } = req.body;

        const newMessage = {
            sentBy,
            sentTo,
            type,
            content,
        }

        const messageCreated = new Message(newMessage);
        const newMsg = await messageCreated.save();
        req.body.messageId = newMsg._id;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            "_message": "Error creating message!",
        });
    }
}


//delete message
const deleteMessage = async (req, res, next) => {
    try{
        const {messageId} = req.body;
        await Message.findByIdAndDelete({_id: messageId});
        next();
    }
    catch(err){
        return res.status(400).json({
            "_message": "Error deleting message!",
        });
    }
}


module.exports = {
    createMessage,
    deleteMessage,
}