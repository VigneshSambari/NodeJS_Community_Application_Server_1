const Room = require("../models/Room.model");
const Profile = require("../models/Profile.model");

const roomMiddleware = async (req, res, next) => {
  try {
    const {roomId, userId} = req.body;
    const currRoom = await Room.findById(roomId);
    const regex = /private/i;
    const hasPrivate = regex.test(currRoom.type);

    if(hasPrivate==true){
      const requestSent = await Room.findOneAndUpdate({_id: roomId}, 
        {
          $addToSet: {
            requests: {
              _id: userId,
            }
          }
        }
      ) 
      await Profile.findOneAndUpdate(
        {userId},
        {
          $addToSet: {
            requestsSent: {
              _id: roomId,
            }
          }
        }
      )
      return res.status(200).json({
        "number":"1", 
      })
    }  

    next();
    
  } catch (err) {
    return res.status(400).json({
      "_message":"Error sending request!"
    });
  }
};

module.exports = {
  roomMiddleware
}; 