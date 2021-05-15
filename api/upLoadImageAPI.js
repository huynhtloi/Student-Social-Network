const express = require('express')
const router = express.Router()
let path = require('path');
const multer = require('multer');
// GET
let myUploadFunction = function _multerFunction(req, res) { 
    let newFileName;
    let storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "public/images/LogoDepartment");
        },
        filename: function (req, file, callback) {
            callback(null, newFileName = Date.now() + "_" + file.originalname);
            getNewFileName(newFileName);
        }
    });



    let upload = multer({ storage : storage}).any();

    upload(req, res,async function (err) {
        if (err) {
            return res.end("Error uploading file. "+ err);
        }
            res.status(200).json({url: "images/LogoDepartment/"+newFileName})
    });
}
let getNewFileName = function getNewCreatedFileName(fileName){
   return fileName;
};

router.get('/' ,async (req,res)=>{
    res.send("Not allow method")
   
    
})
router.post('/', (req, res) => {
    myUploadFunction(req, res)

})


module.exports = router