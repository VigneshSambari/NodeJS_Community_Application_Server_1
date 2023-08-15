const Message = require('../models/Message.model');

const requestNew = {
    new: true,
}

const fetchListedMessages = async (req, res) => {
    try{
        const {ids} = req.body;
        const messages = await Message.find(
            {
                _id: {
                    $in: ids
                }
            }
        ).sort({ createdAt: 1 }) // sort by createdAt in ascending order
        .exec();
        
        return res.status(200).json(messages);
    }
    catch(err){
        //console.log(err);
        return res.status(400).json({
            "_message": "Error fetching listed messages!",
        })
    }
}


//reply to message by messageID
const replyMessage = async (req, res) => {
    try{
        const {messageId, repliedBy, reply} = req.body;
        const repliedMsg = await Message.findByIdAndUpdate(
            {_id: messageId},
            {
                $push: {
                    replies: {
                        reply,
                        repliedBy,
                        time: Date(),
                    }
                }
            },
            requestNew,
        );
        return res.json(repliedMsg); 
    }
    catch(err){
        return res.json(err);
    }
}


//delete reply by messageId and replyId
const deleteReply = async (req, res) => {
    try{
        const {messageId, replyIds} = req.body;
        const deletedReply = await Message.findByIdAndUpdate(
            {_id: messageId},
            {
                $pull: {
                    replies: {
                        _id: {
                            $in: replyIds,
                        }
                    }
                }
            },
            requestNew,
        );
        return res.json(deletedReply); 
    }
    catch(err){
        return res.json(err);
    }
}



module.exports = {
    replyMessage,
    deleteReply,
    fetchListedMessages
}