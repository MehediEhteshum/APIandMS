const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer().single('upfile');

// POST /api/fileanalyse
let uploadPath = "/api/fileanalyse";
let uploadPoster = (req, res, next) => {
  if(!req.file){
    return res.send("Please choose a file.");
  }

  let filename = req.file.originalname;
  let filetype = req.file.mimetype;
  let filesize = req.file.size;  
  return res.json({name: filename, type: filetype, size: filesize});
};
app.post(uploadPath, upload, uploadPoster);

module.exports = app;