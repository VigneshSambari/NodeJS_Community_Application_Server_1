const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("config");
const JwtKey = config.get("JwtKey");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    console.log("no token found ");
    return res.status(401).json({ msg: "No token auth denied" });
  }

  try {
    const decode = jwt.verify(token, JwtKey);
    req.user = decode;
    next();
  } catch (err) {
    console.log("err in auth middleware ");
    return res.status(401).json({ msg: "token is not valid " });
  }
};

module.exports = {authMiddleware};