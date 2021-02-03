require('dotenv-safe').config();
const {response} = require('express');
const User = require('../models/User');
const LoginDetails = require('../models/LoginDetails');
const sharp = require('sharp');

const nodemailer = require('nodemailer');
const Email = require('email-templates');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
  }
  });
  const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
});

//SHOW ALL USERS
const index = (req,res) => {
  User.find().sort({createdAt:-1})
  .then(response=>{
    res.json({
      response
    })
  })
  .catch({
    response:'false'
  })
}

//STORE USER DETAILS
const store = (req,res) => {

    sharp(req.file.path).rotate().resize(150, 150).toFile('uploads/userimages/' + 'small-' + req.file.filename, (err, resizeImage) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resizeImage);
      }
    })

    // sharp(req.file.path).rotate().resize(400, 200).toFile('uploads/userimages/' + 'medium-' + req.file.filename, (err, resizeImage) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(resizeImage);
    //   }
    // })
    //
    // sharp(req.file.path).rotate().resize(1200, 800).toFile('uploads/userimages/' + 'large-' + req.file.filename, (err, resizeImage) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(resizeImage);
    //   }
    // })


  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.contact = req.body.contact;
  user.password = req.body.password;
  user.usertype = req.body.usertype;
  user.city = req.body.city;
  user.state = req.body.state;
  user.country = req.body.country;
  user.image = req.file.path;
  user.imagethumb = 'uploads/userimages/' + 'small-'+ req.file.filename;
  // user.imagemedium = 'uploads/userimages/' + 'medium-'+ req.file.filename;
  // user.imagelarge = 'uploads/userimages/' + 'large-'+ req.file.filename;

  user.save((err,doc)=>{
    if(!err){
      res.json({
        response:'true',
        message:'Successfully Registrated.'
      })
    }else{
      res.json({
        response:'false'
      })
    }
  })

}


//userregister
const userregister = (req,res) => {
  User.find({email: req.body.email}, (err,doc)=>{
          if(!err){
            if(doc.length>0){
              res.json({
                response:true,
                message:'Email Available'
              })
            }else{
              var user = new User();
              user.name=req.body.name;
              user.email=req.body.email;
              user.password=req.body.password;
              user.email_verify='Not Verified';
              user.save((err,doc)=>{
                if(!err){
                  res.json({
                    response:true,
                    message:'Registration Success'
                  })
                }else{
                  res.json({
                    response:false,
                    message:'Failed'
                  })
                }
              })
            }
          }else{
            res.json({
              message:'failed'
            })
          }
        })
}



//socialloginregister
const socialloginregister = (req,res) => {
  User.find({email: req.body.email}, (err,doc)=>{
          if(!err){
            if(doc.length>0){
              res.json({
                response:true,
                data:doc,
                message:'Login Success'
              })
            }else{
              var user = new User();
              user.name=req.body.name;
              user.email=req.body.email;
              user.password=req.body.password;
              user.image=req.body.profilePicURL;
              user.imagethumb=req.body.profilePicURL;
              user.imagemedium=req.body.profilePicURL;
              user.imagemedium=req.body.profilePicURL;
              user.email_verify='Verified';
              user.save((err,doc)=>{
                if(!err){
                  res.json({
                    response:true,
                    data:doc,
                    message:'Registration Success'
                  })
                }else{
                  res.json({
                    response:false,
                    message:'=Failed'
                  })
                }
              })
            }
          }else{
            res.json({
              message:'failed'
            })
          }
      })
}


//VIEW
const view = (req,res) => {

 User.findById(req.params.id, (err,doc) => {
   if(!err){
     res.json({
       response:'true',
       data:doc
     })
   }else{
     res.json({
       response:'false',

     })
   }
 })

}

//UPDATE
const update = (req,res) => {

  if(req.file){
    sharp(req.file.path).rotate().resize(150, 150).toFile('uploads/userimages/' + 'small-' + req.file.filename, (err, resizeImage) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resizeImage);
      }
    })

    // sharp(req.file.path).rotate().resize(400, 200).toFile('uploads/userimages/' + 'medium-' + req.file.filename, (err, resizeImage) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(resizeImage);
    //   }
    // })
    //
    // sharp(req.file.path).rotate().resize(1200, 800).toFile('uploads/userimages/' + 'large-' + req.file.filename, (err, resizeImage) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(resizeImage);
    //   }
    // })
  }

  let updatedData = {
    name:req.body.name,
    email:req.body.email,
    contact:req.body.contact,
    usertype:req.body.usertype,
    city:req.body.city,
    state:req.body.state,
    country:req.body.country,
  }

  if(req.file){
    updatedData.image = req.file.path;
    updatedData.imagethumb = 'uploads/userimages/' + 'small-'+ req.file.filename;
  }

  User.findByIdAndUpdate(req.params.id, {$set: updatedData})
  .then(response=>{
    res.json({
      response:'true'
    })
  })

}


const deleteuser = (req,res) => {

  User.findByIdAndRemove(req.params.id, (err,doc) => {
    if(!err){
      res.json({
        response:'true'
      })
    }else{
      res.json({
        response:'false'
      })
    }
  })


}


//LOGIN
const login = (req,res) => {
  User.findOne({
    email:req.body.email,
    password:req.body.password
  },function(err,doc){
    if(!err){

      if(doc === null){
        res.json({
          response:'false',
          message:'Check user email and password'
        })
      }else{


        var logindetails = new LoginDetails();
        logindetails.user_email = req.body.email;
        logindetails.ip_ip = req.body.ip_ip;
        logindetails.ip_continent_name = req.body.ip_continent_name;
        logindetails.ip_country_name = req.body.ip_country_name;
        logindetails.ip_country_code = req.body.ip_country_code;
        logindetails.ip_region = req.body.ip_region;
        logindetails.ip_city = req.body.ip_city;
        logindetails.ip_latitude = req.body.ip_latitude;
        logindetails.ip_longitude = req.body.ip_longitude;
        logindetails.ip_country_flag = req.body.ip_country_flag;
        logindetails.ip_timezone = req.body.ip_timezone;
        logindetails.ip_country_calling_code = req.body.ip_country_calling_code;
        logindetails.ip_currency = req.body.ip_currency;
        logindetails.ip_currency_name = req.body.ip_currency_name;
        logindetails.ip_languages = req.body.ip_languages;
        logindetails.ip_country_area = req.body.ip_country_area;
        logindetails.ip_country_area = req.body.ip_country_area;
        logindetails.ip_country_population = req.body.ip_country_population;
        logindetails.ip_org = req.body.ip_org;
        logindetails.osName = req.body.osName;
        logindetails.osVersion = req.body.osVersion;
        logindetails.mobileVendor = req.body.mobileVendor;
        logindetails.mobileModel = req.body.mobileModel;
        logindetails.deviceType = req.body.deviceType;
        logindetails.browserName = req.body.browserName;
        logindetails.browserVersion = req.body.browserVersion;
        logindetails.fullBrowserVersion = req.body.fullBrowserVersion;
        logindetails.save();


        res.json({
          response:'true',
          data:doc
        })


      }

    }else{
      res.json({
        response:'false',
        message:'Login failed'
      })
    }
  })
}


// LOGIN DETAILS
const logindetails = (req,res) => {
  LoginDetails.find().sort({createdAt:-1})
  .then(response=>{
    res.json({
      response:true,
      data:response
    })
  })
}


// VIEW LOGIN DETAILS
const logindetailsview = (req,res) => {
  LoginDetails.findById(req.params.id, (err,doc) => {
    if(!err){
      res.json({
        response:'true',
        data:doc
      })
    }else{
      res.json({
        response:'false',

      })
    }
  })
}

const forgotpassword = (req,res) => {

  User.findOne({
    email:req.params.email
  },function(err,doc){
    if(!err){

      if(doc===null){
        res.json({
          response:'false',
          message:'Email is not registrated',
          ip:req.ipInfo

        })
      }else{

        email.send({
          template: 'hello',
          message: {
            from: process.env.EMAIL_USER,
            to: req.params.email,
            // attachments: [
            //   {
            //     filename: 'thankyou.docx',
            //     content: 'Thanks'
            //   }
            // ]
          },
          locals: {
            name: doc.name,
            password:doc.password
          }
      	}).then(() => console.log('email has been sent!'));

        res.json({
          response:'true',
          data:doc
        })
      }
    }else{

    }
  })

}


// **MODULE EXPORTS**
module.exports = {index, store, update,deleteuser, login, forgotpassword, view, logindetails, logindetailsview, userregister,socialloginregister}
