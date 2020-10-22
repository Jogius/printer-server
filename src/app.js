const express = require("express");

const app = express();
app.disable("x-powered-by");

const cors = require("cors");
app.use(cors({origin: process.env.ORIGIN_DOMAIN}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

module.exports = app;
