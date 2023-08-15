const PersonalChat = require("../models/PersonalChat.model");
const {returnNew} = require('../utils/basicFunctions');


//create personal chat model if it doesnot exist
const createChat = async (req, res) => {
    try{
        const {user1, user2} = req.body;
        const exists = await PersonalChat.findOne(
            {
                $or: [
                    {chatId: `${user1._id}${user2._id}`},
                    {chatId: `${user2._id}${user1._id}`}
                ]
            }
        )
        if(exists){
            //console.log("exists");
            return res.json(exists);
        }
        user1.fetchAfter = Date();
        user2.fetchAfter = Date();
        const currChat = {
            users: [user1, user2],
            chatId: `${user1._id}${user2._id}`
        }
        const chatCreated = new PersonalChat(currChat);
        await chatCreated.save();
        return res.json(chatCreated);
    }
    catch(err){
        //console.log(err)
        return res.json(err);
    }
}


//text the user two on two chat
const textUser = async (req, res) => {
    try{
        const {messageIds, chatId, userId} = req.body;
        const msgAdded = await PersonalChat.findOneAndUpdate(
            {_id: chatId, "users._id": userId},
            {
                $push: {
                    "users.$.messages": {
                        $each: messageIds
                    }
                }
            },
            returnNew
        )
        return res.json(msgAdded);
    }
    catch(err){
        //console.log(err)
        return res.json(err)
    }
}


//delete chat from two on two chat
const deleteChat = async (req, res) => {
    try{
        const {chatId, messageIds, userId} = req.body;
        const msgRemoved = await PersonalChat.findOneAndUpdate(
            { _id: chatId, "users._id": userId },
            {
              $pull: {
                "users.$.messages": {
                    _id: { 
                        $in: messageIds
                    },
                },
              },
            },
            { new: true }
          );
          
        return res.json(msgRemoved);
    }
    catch(err){
        return res.json(err);
    }
}


//check if member of chat
const checkMember = async (req, res) => {
    try{
        const {chatId, userId} = req.body;
        const isMember = await PersonalChat.findOne(
            {
                _id: chatId,
                'users._id': userId
            }
        )
        return res.json(isMember);
    }
    catch(err){
        return res.json(err);
    }
}

module.exports = {
    createChat,
    textUser,
    deleteChat,
    checkMember,
}