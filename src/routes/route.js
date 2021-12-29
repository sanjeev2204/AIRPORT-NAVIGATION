const express=require("express");
const app=express();
const router=express.Router();
const multer=require("multer");
const storage=multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,'uploads');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
        // cb(null,new Date().toString().replace(/:/g,'-')+file.originalname);
    }
})

const uploadImg=multer({storage:storage}).single('image');
// const {body,validationResult}=require("express-validator")

// const auth=require('../middleware/auth')
const AuthController=require("../controllers/auth.mongo.controller");

router.route('/auth/signup').post(uploadImg, AuthController.signup);
router.route('/auth/login').post(AuthController.login);
router.route('/auth/getAllData').get(require('../middleware/auth'),AuthController.getAllData);
router.route('/auth/sendOTP').post(AuthController.sendOTP);
router.route('/auth/resetPassword').post(require('../middleware/auth'),AuthController.resetPassword);
router.route('/auth/updateUser').put(require('../middleware/auth'), AuthController.updateUser);
router.route('/auth/deleteUser').delete(require('../middleware/auth'), AuthController.deleteUser);
// app.use()
// router.route('/auth/update/:id').put(AuthController.updateUser)
// wish list Routers
router.route('/auth/SaveWishlist').post(require('../middleware/auth'),AuthController.SaveWishlist);
router.route('/auth/GetAllWishList').get(require('../middleware/auth'),AuthController.GetAllWishList);
router.route('/auth/DeleteWishlist/:id').delete(require('../middleware/auth'),AuthController.DeleteWishlist);
// router.route('/auth/DeleteWishlist').delete(require('../middleware/auth'),AuthController.DeleteWishlist);
router.route('/auth/UpdateWishlist/:id').put(require('../middleware/auth'),AuthController.UpdateWishlist);











module.exports=router;


