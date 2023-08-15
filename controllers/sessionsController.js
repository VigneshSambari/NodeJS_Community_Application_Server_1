const Session = require("../models/Sessions.model");
const Profile = require('../models/Profile.model');
const {returnNew} = require('../utils/basicFunctions');



const  getAllSessions = async (req, res) => {
    try{
        const allSessions = await Session.find();
        return res.status(200).json(allSessions);
    }
    catch(err){
        return res.status(400).json({
            "_message": "Internal server error in fetching all Sessions!"
        });
    }
}


const createSession = async (req,res) => {
    
    try{
        // console.log("called");
        const {
            field,
            startDate,
            endDate,
            payAmount,
            roomId,
            createdBy,
            startTime,
            endTime,
            repeat,
        } = req.body;
    
        const newSession = {
            field,
            startDate,
            endDate,
            payAmount,
            roomId,
            createdBy,
            startTime,
            endTime,
            repeat,
        }
        const session = new Session(newSession);
        const created = await session.save();
        await Profile.findOneAndUpdate(
            {userId: createdBy},
            {
                $push: {
                    sessions : {
                        _id: created._id,
                    }
                }
            }
        )

        // console.log(created);
        return res.status(200).json(session);
    }
    catch(err){

        // console.log(err);
        return res.status(400).json({
                "_message" :" Internal server error in creating Session!",
            });
    }
}

const fetchListedSessions = async (req, res) => {
    try{
        const {ids} = req.body;
        const sessions = await Session.find(
            {
                _id: {
                    $in: ids
                }
            }
        ).sort({ createdAt: 1 }) // sort by createdAt in ascending order
        .exec();
        
        return res.status(200).json(sessions);
    }   
    catch(err){
        return res.status(400).json({
            "_message":" Error in fetching dated sessions",
        })
    }
}


const exitSession = async (req,res) => {

    const {sessionId, userId} = req.body._id;
    try{;
        await Profile.findOneAndUpdate(
            {userId},
            {
                $pull: {
                    _id: sessionId,
                }
            }
        )
       
        return res.status(200).json(deletedSession);
    }
    catch(err){

        // console.log(err);
        return res.status(400).json({
            "_message": "Internal server error in exiting sessions!"
        });
        
    }
}


const updateSession  = async (req, res) => {

    // console.log(req.body);
    const {
        sessionId,
        name,
        field,
        description,
        payAmount,
        type,
        tags,
        startTime,
        endTime,
        repeat,            
    } = req.body;

    try{
        const updatedSession = await Session.findOneAndUpdate(
            {_id: sessionId},
            {
                name,
                field,
                description,
                payAmount,
                type,
                tags,
                startTime,
                endTime,
                repeat,
            },
            returnNew,
        );

   
        return res.status(200).json(updatedSession);
    }
    catch(err){
        // console.log(err);
        return res.status(400).json({
            "_message": "Internal server error in updating Session!"
        })
    }
}


const joinSession = async (req,res) => {
    try{
        const {userId, sessionId} = req.body;
        await Profile.findOneAndUpdate(
            {userId},
            {
              $push: {
                sessions: {
                  _id: sessionId,
                }
              }
            }
          )
        return res.status(200).json({});
    }
    catch(err){
        return res.status(400).json({
            "_message": "Error in joining session!",
        })
    }
}


const removeSession = async (req,res) => {
    try{
        const {userId, sessionId} = req.body;
        await Profile.findOneAndUpdate(
            {userId},
            {
              $pull: {
                sessions: {
                  _id: sessionId,
                }
              }
            }
          )
        return res.status(200).json({});
    }
    catch(err){
        return res.status(400).json({
            "_message": "Error in removing session!",
        })
    }
}



const findSessionRoomId = async (req,res) => {
    try{
        const {_id} = req.body;
        const session=await Session.findOne(
            {roomId:_id},
          )
          console.log(session);
        return res.status(200).json(session);
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            "_message": "Error in finding session!",
        })
    }
}




module.exports = {
    updateSession, 
    exitSession, 
    createSession,
    getAllSessions,
    fetchListedSessions,
    joinSession,
    removeSession,
    findSessionRoomId
}