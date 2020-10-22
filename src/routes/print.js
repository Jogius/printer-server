const router = require("express").Router();

const {exec} = require("child_process");
const path = require("path");
const multer  = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "tmp/");
  },
  filename: (req, file, callback) => {
    callback(null, (Date.now() * Math.random()) + path.extname(file.originalname));
  },
});
const upload = multer({storage: storage});

router.post("/", upload.any(), async (req, res) => {
  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      exec(`sudo unoconv -f pdf --stdout ${req.files[i].path} | lp`, (err, stdout, stderr) => {
        if (err) return res.json({error: `error: ${err.message}`});
        if (stderr) return res.json({error: `stderr: ${stderr}`});
      });
    }
  }
  if (req.body.text) {
    exec("fold -s EOF\n" + req.body.text + "\nEOF | lp", (err, stdout, stderr) => {
      if (err) return res.json({error: `error: ${err.message}`});
      if (stderr) return res.json({error: `stderr: ${stderr}`});
    });
  }
  res.json({message: "Druck wurde gestartet"});
});

module.exports = router;