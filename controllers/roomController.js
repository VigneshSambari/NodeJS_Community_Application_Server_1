const {v4: uuidv4} = require("uuid");
const Profile = require("../models/Profile.model");
const Room = require("../models/Room.model");
const MessageList = require("../models/MessageList.model");
const mongoose = require("mongoose");


const requestNew = {
  new: true,
}



// Get all rooms (public) (Get)
const getRooms = async (req, res) => {
  try {
    const allRooms = await Room.find();
    console.log("success fetching rooms");
    return res.status(200).json(allRooms);
  } catch (err) {
    
    console.log(err);
    return res.status(400).json({
      "_message": "Error in fetching all rooms!",
    })
  }
};

const getQueryRooms = async (req, res) => {
  try {
    const {type,query}=req.body;
    const allRooms = await Room.find({
      type: { $nin: ["sessionPublic", "sessionPrivate"], $regex: new RegExp(type, "i") },
      name: { $regex: new RegExp(query, "i") }
    });
    console.log("success fetching rooms");
    return res.status(200).json(allRooms);
  } catch (err) {
    
    console.log(err);
    return res.status(400).json({
      "_message": "Error in querying rooms!",
    })
  }
};

const getQuerySessionRoom = async (req, res) => {
  try {
    const {type,query}=req.body;
    const allRooms = await Room.find({
      type: { $regex: new RegExp(type, "i") },
      name: { $regex: new RegExp(query, "i") }
    });
    console.log(allRooms);
    return res.status(200).json(allRooms);
  } catch (err) {
    
    console.log(err);
    return res.status(400).json({
      "_message": "Error in querying sessions!",
    })
  }
};



const fetchListedRooms = async (req, res) => {
  try{
      const {ids} = req.body;
      console.log(ids);
      const rooms = await Room.find(
          {
              _id: {
                  $in: ids
              }
          }
      ).sort({ createdAt: 1 }) // sort by createdAt in ascending order
      .exec();
      console.log(rooms);
      return res.status(200).json(rooms);
  }
  catch(err){
      console.log(err);
      return res.status(400).json({
          "_message": "Error fetching listed rooms!",
      })
  }
}


const getRoomOfType = async (req, res) => {
  try{
    const {type} = req.params;

    const rooms = await Room.find({
      type
    })
    
    return res.status(200).json(rooms);
  }
  catch(err){
    console.log(err);
    return res.status(400).json({
      "_message": "Error in fetching rooms!",
    })
  }
}


// Create a room (Private) (Post)
const createRoom = async (req, res) => {
  try {
    const {
      name,
      userName,
      type,
      description,
      createdBy,
      coverPic,
      tags=[],
    } = req.body;

    const users = [{_id: createdBy,admin: true}];

    const curRoom = {
      name,
      userName,
      type,
      description,
      createdBy,
      users,
      coverPic,
      tags,
    };
    
     
    var tempRoom = new Room(curRoom);
    await tempRoom.save();
    console.log(tempRoom);


    var roomMessageList = new MessageList({roomId: tempRoom._id});
    await roomMessageList.save();

    const roomData = await Room.findByIdAndUpdate(
      {_id: tempRoom._id},
      {
        messageListId: roomMessageList._id,
      },
      requestNew,
    )
    
    await Profile.findOneAndUpdate(
      {userId: createdBy},
      {
        $push: {
          rooms: {
            _id: tempRoom._id,
          }
        }
      }
    )


    console.log("success aading rooms");
    return res.status(200).json(roomData);

  } catch (err) {
    
    console.log(err);
    res.status(400).json({
      "_message": "Error in creating room!",
    })
  }
};

//function to add user to group
const findAndAdd = async ({userId, roomId}) => {
  try{
    await Room.findOneAndUpdate(
      {_id: roomId}, 
      {
        $addToSet: {
          users: {
            _id: userId,
          }
        }
      }
    );

    await Profile.findOneAndUpdate(
      {userId},
      {
        $addToSet: {
          rooms: {
            _id: roomId,
          }
        }
      }
    )
  }
  catch(err){
    throw err;
  }
}


//function to add user to group
const addUserToGroup = async (req, res) => {
  try{
    const {userId, roomId}=req.body;
    await Room.findOneAndUpdate(
      {_id: roomId}, 
      {
        $addToSet: {
          users: {
            _id: userId,
          }
        },
        $pull:{
          requests:{
            _id: userId,
          }
        }
      }
    );

    await Profile.findOneAndUpdate(
      {userId},
      {
        $addToSet: {
          rooms: {
            _id: roomId,
          }
        },
        $pull:{
          requestsSent:{
            _id: roomId,
          }
        }
      }
    )
    console.log("Added to room");
    return res.status(200).json({});
  }
  catch(err){
    console.log(err);
    return res.status(400).json({
      "_message":"Error adding user to group",
    })
  }
}

//function to add user to group
const removeUserFromGroup = async (req, res) => {
  try{
    const {userId, roomId}=req.body;
    await Room.findOneAndUpdate(
      {_id: roomId}, 
      {
        $pull: {
          users: {
            _id: userId,
          }
        },
      }
    );

    await Profile.findOneAndUpdate(
      {userId},
      {
        $pull: {
          rooms: {
            _id: roomId,
          }
        },
      }
    )
    console.log("removed from room");
    return res.status(200).json({});
  }
  catch(err){
    console.log(err);
    return res.status(400).json({
      "_message":"Error removing user from group",
    })
  }
}




//function to remove user from group
const findAndRemove = async ({userId, roomId}) => {
  try{
    await Room.findByIdAndUpdate(
      {_id: roomId}, 
      {
        $pull: {
          users: {
            _id: userId,
          }
        }
      }
    );

    await Profile.findByIdAndUpdate(
      {userId},
      {
        $pull: {
           rooms: {
            _id: roomId,
           }
        }
      }
    )
  }
  catch(err){
    //console.log(err);
    throw err;
  }
}


// Join a room (Private) (post)
const joinOrLeaveRoom = async (req, res) => {
  const {userId, roomId, joinOrLeave} = req.body;
  try {
    //console.log(userId)
    const userAdded = joinOrLeave === "join" 
    ? await findAndAdd({userId, roomId})
    : await findAndRemove({userId, roomId}); 
    

    console.log("success joining/leaving rooms");
    return res.status(200).json({
      "number":"2",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      "_messsage": "Unable to join room!",
    })
    //console.log(err);
  }
};

//join via link route by roomId
const joinViaLink = async (req, res) => {
  const {roomId} = req.params;
  try {
    const roomDetails = await Room.findById({_id: roomId});
    // const userAdded = await Room.findByIdAndUpdate(
    //   {_id: roomId}, 
    //   {
    //     $addToSet: {
    //       users: {
    //         _id: req.user,
    //       }
    //     }
    //   }
    // );
    const userAdded = await findAndAdd(
      {
        userId: req.user, 
        roomId: req.params.roomId, 
        createdAt: roomDetails.createdAt
      }
    );
    //console.log(userAdded)
    //console.log("success joining/leaving rooms");
    return res.json({
      "_message": "Successfully joined/left room"
    });
  } catch (err) {
    res.send("internal server Error in joining rooms").status(500);
    //console.log(err);
  }
}


//check is a user belongs to the given room
const checkIfMember = async (req, res) => {
  try{
    const {userId, roomId} = req.body;
    const fetchedRoom = await Room.findOne(
      {
        _id: roomId,
        $or: [
          {"users._id": userId},
        ]
      }
    )
    return res.json(fetchedRoom);
  }
  catch(err){
    // console.log(err);
    return res.json(
      {
        "_message": "Error in checking if memeber of room!",
      }
    )
  }
}

const addMessage = async (req, res) => {
  try{
    
    const {messageId, roomId} = req.body;
    // console.log(req.body);
    const messageListUpdated = await MessageList.findOneAndUpdate(
      {roomId},
      {
        $push: {
            messages: {
             _id: messageId,
         }
        }
      },
      {
        new: true
      }
    )
    return res.status(200).json({
      "_message": "Successfully sent message",
    })
  }
  catch(err){
    return res.status(400).json({
      "_message": "Error in adding message to room!",
    })
  }
}


const deleteMessageFromList = async (req, res) => {
  try{
    
    const {messageId, roomId} = req.body;
    
    const messageListUpdated = await MessageList.findOneAndUpdate(
      {roomId},
      {
        $pull: {
            messages: {
             _id: messageId,
         }
        }
      },
      requestNew
    )
    // console.log(messageListUpdated);
    return res.status(200).json({
      "_message": "Succesfully deleted message!",
    });
  }
  catch(err){
    // console.log(err);
    return res.status(400).json({
      "_message": "Error in adding message to room!",
    })
  }
}


const fetchPaginatedMessages = async (req, res) => {
  try {
    const { roomId, page = 1, limit} = req.body;
    const limitNum =  parseInt(limit);
    var startIndex = (page - 1) * 20;
    if(limitNum != 20){
      startIndex = startIndex + 20 - limitNum ;
    }
    
   //console.log(startIndex, " ", limitNum);
    const messages = await MessageList.aggregate([
      {
        $match: {
          roomId: mongoose.Types.ObjectId(roomId)
        }
      },
      {
        $project: {
          messages: { $slice: ["$messages", startIndex, limitNum] }
        }
      }
    ]);
    //console.log(messages[0].messages);
    return res.status(200).json(messages[0].messages);
  } catch (err) {
    // console.log(err);
    return res.status(400).json({
      _message: "Error fetching messages!"
    });
  }
};




module.exports = {
  getRooms,
  createRoom,
  deleteMessageFromList,
  checkIfMember,
  joinOrLeaveRoom,
  joinViaLink,
  addMessage,
  getRoomOfType,
  fetchPaginatedMessages,
  fetchListedRooms,
  getQueryRooms,
  addUserToGroup,
  removeUserFromGroup,
  getQuerySessionRoom
};