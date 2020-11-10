var express = require("express");
var router = express.Router();

var HandlerGenerator = require("../public/javascripts/handlegenerator");
var middleware = require("../public/javascripts/middleware.js");

HandlerGenerator = new HandlerGenerator();

/* GET home page. */
router.get("/", middleware.checkToken, HandlerGenerator.index);

router.post("/login", HandlerGenerator.login);

module.exports = router;
