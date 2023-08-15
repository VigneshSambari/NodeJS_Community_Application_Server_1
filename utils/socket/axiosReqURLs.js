const config = require('config');

const profileURLS = {
    "setOnline": `${config.get("CurrentURL")}profile/setonline/`,
    "setOfflineLastSeen": `${config.get("CurrentURL")}profile/setoffline/`,
    
}


const roomURLS = {
    "checkIfMemberOfRoom": `${config.get("CurrentURL")}room/checkmember/`,
}


const personalChatURLS = {
    "checkIfMemberOfChat": `${config.get("CurrentURL")}textuser/checkmember/`,
}

module.exports = {
    profileURLS,
    roomURLS,
    personalChatURLS,
}