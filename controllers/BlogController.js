const {response} = require('express');
const Blog = require('../models/Blog');
const sharp = require('sharp');


//SHOW ALL BLOGS
const index = (req,res) => {
  Blog.find().sort({createdAt:-1})
  .then(response=>{
    res.json({
      response:response
    })
  })
}


//LATEST BLOGS
const latestblog = (req,res) => {
  const no = Number(req.params.no);
  Blog.find({},{'_id':1,'totalurl':1,'imagethumb':1,'title':1,'description':1}).sort({_id:-1}).limit(no).exec(function(err,response){
    if(!err){
      res.json({
        message:'success',
        latestblogs:response
      })
    }else{
      res.json({
        message:'failed'
      })
    }
  })
}

//RELATED ARTICLE BY CATEGORY
const relatedarticle = (req,res) => {
  const no = Number(req.params.no);
  const getcategory = req.params.categoryname.replace(/\b\w/g, l => l.toUpperCase());

  Blog. aggregate([
    {$match:{category:getcategory}},
    {$sample:{size:no}}
  ]).sort({_id:-1}).exec(function(err,response){

    if(!err){
      res.json({
        response:true,
        data:response
      })
    }else{
      res.json({
        response:false
      })
    }
  })
}



const viewcategorylist = (req,res) => {
  Blog.find({category:req.params.categoryname.replace(/\b\w/g, l => l.toUpperCase())}).sort({createdAt:-1})
  .then(response=>{
    if(response.length>0){
      res.json({
        response:true,
        data:response,
      })
    }else{
      res.json({
        response:false,
      })
    }
  })
}




//STORE BLOG
const store = (req,res) => {

    sharp(req.file.path).resize(400, 270).toFile('uploads/blogimages/' + 'thumbnails-' + req.file.filename, (err, resizeImage) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resizeImage);
      }
    })

    // var urlLower = req.body.title.toLowerCase();
    // var url = urlLower.replace(/ /g,'-');

    var blog = new Blog();
    blog.blogurl = req.body.blogurl;
    blog.categoryurl = '/blogs/'+req.body.category.toLowerCase();
    blog.totalurl = '/blogs/'+req.body.category.toLowerCase()+'/'+req.body.blogurl;
    blog.title= req.body.title;
    blog.description= req.body.description;
    blog.category= req.body.category;
    blog.imagethumb= 'uploads/blogimages/' + 'thumbnails-' + req.file.filename;
    blog.image= req.file.path;
    blog.content= req.body.content;
    blog.metatitle= req.body.metatitle;
    blog.metadescription= req.body.metadescription;
    blog.auth_email= req.body.auth_email;
    blog.auth_id= req.body.auth_id;
    blog.save((err,doc)=>{
      if(!err){
        res.json({
          response:'true',
          message:'Successfully Created'
        })
      }else{
        res.json({
          response:'false',
          message:'Failed'
        })
      }
    })
}

//VIEW BY URL
const viewbyurl = (req,res) => {
  Blog.findOne({blogurl:req.params.url}, (err,doc)=>{
    if(!err){
      res.json({
        response:true,
        data:doc,
      })
    }else{
      res.json({
        response:false
      })
    }
  })
}




//VIEW
const view = (req,res) => {
  Blog.findById(req.params.id,(err,doc) => {
    if(!err){
      res.json({
        response:'true',
        data:doc
      })
    }else{
      res.json({
        response:'false'
      })
    }
  })
}


//UPDATE
const update = (req,res) => {

  if(req.file){
    sharp(req.file.path).resize(400, 270).toFile('uploads/blogimages/' + 'thumbnails-' + req.file.filename, (err, resizeImage) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resizeImage);
      }
    })
  }

  // var urlLower = req.body.title.toLowerCase();
  // var url = urlLower.replace(/ /g,'-');

  let updateData = {
    // blogurl : req.body.url,
    categoryurl : '/blogs/'+req.body.category.toLowerCase(),
    totalurl : '/blogs/'+req.body.category.toLowerCase()+'/'+req.body.blogurl,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    content: req.body.content,
    metatitle: req.body.metatitle,
    metadescription: req.body.metadescription,
    auth_email: req.body.auth_email,
    auth_id: req.body.auth_id,
  }

  if(req.file){
    updateData.image = req.file.path,
    updateData.imagethumb = 'uploads/blogimages/' + 'thumbnails-' + req.file.filename
  }

  Blog.findByIdAndUpdate(req.params.id, {$set:updateData})
  .then(response=>{
    res.json({
      response:'true'
    })
  })
}


const deleteblog = (req,res) => {
  Blog.findByIdAndRemove(req.params.id,(err,doc)=>{
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



// **MODULE EXPORTS**
module.exports = {
  index,store,view,update,deleteblog,viewcategorylist,latestblog,viewbyurl,relatedarticle
}
