const express = require ('express')
const router = express.Router();
const User = require('../models/users')
const multer = require('multer')
const path = require('path');
const { redirect } = require('express/lib/response');
const fs= require('fs')
const app= express()
app.use(express.static(__dirname));

//image upload 
var storage = multer.diskStorage({

    destination:function(req,file,cb){
        cb(null, "./uploads/")

    },
    filename: function(req,file,cb){
        cb(null, file.fieldname +"_"+ Date.now()+ "_" +file.originalname)

    }
})

var upload = multer({
    storage: storage,
}).single("image");

// insert an user into database  route

router.post('/add',upload,(req,res)=>{
const user = new User({
    name: req.body.name,
    email: req.body.email,
    image: req.file.filename,
    phone: req.body.phone 
})
user.save((err)=>{
    if(err){
        res.json({message : err.message, type:'danger'})
    }else{
        req.session.message = {
            type: 'success',
            message: 'User added successfully !'
        }
        res.redirect('/')
    }
})
})
//get all user router 

router.get("/", (req,res)=>{
    User.find().exec((err, users)=>{
        if(err){
            res.json({ message: err.message })
        }else{
            res.render('index',{
                title:'home page',
                users:users,
            })
        }
    })
})

router.get('/',(req,res)=>{

    //res.send("home page ");
    res.render('index', {title: ' hafsi  home page '})
})


router.get('/add', (req,res)=>{
    res.render("add_users", {title: 'add users'})
})

router.get('/page2', (req,res)=>{
    res.render("page2", {title: 'page2'})
})
router.get('/page3', (req,res)=>{
    res.render("page3", {title: 'page3'})
})

router.get('/page4', (req,res)=>{
    res.render("page4", {title: 'page4'})
})

router.get('/slide', (req,res)=>{
    res.render("slide", {title: 'slide'})
})
// edit user rrouter

router.get('/edit/:id',(req,res)=>{
 const id = req.params.id;
 User.findById(id,(err, user)=>{
    if(err){
        res.redirect('/');

    }else{
        if(user == null){
            res.redirect('/');
        }
        else{
            res.render('edit_users',{
                title: 'edit user',
                user:user,
            })
     

    }  
     }
 })
})

//update user router
router.post('/update/:id',upload,(req,res)=>{

const id = req.params.id;
let new_image='';
if(req.file){
    new_image = req.file.filename;
    try{
        fs.unlinkSync('./uploads/'+req.body.old_image);
    }catch(err){
        console.log(err)
    }
}else{
    new_image = req.body.old_image;
}
User.findByIdAndUpdate(id, {
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    image:new_image,
}, (err, result)=>{
    if(err){
        res.json({message: err.message , type:'danger'})
    }else {
        req.session.message = {
            type:"success",
            message : " user updated successfully"
        }
        res.redirect('/');

    }
})
})

// delete user route
router.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    User.findByIdAndRemove(id,(err,result)=>{
        if(result.image!= ''){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            }catch(err){
                console.log(err)
            }
        } if(err){
            res.json({message: err.message});
        }else {
            req.session.message={
                type: 'info',
                message:'user deleted sucessulfly'
            };
            res.redirect('/');
        }
    })
})


module.exports = router;
