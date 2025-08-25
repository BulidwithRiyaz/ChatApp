const express =require("express");
const app = express();
const path =require("path");
const mongoose = require('mongoose');
const methodOverride =require("method-override");
const Chat =require("./model/chat.js");
const ExpressError =require("./ExpressError.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");


app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); 


main().then(res => console.log("database connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');
}

// app.use((req,res,next) =>{
//     req.responseTime = new Date().toString();
//     console.log(req.method,req.path,req.hostname);
//     console.log(req.responseTime);
//     return next();
// })



// wrapAsync error function
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err));
    }
}

const accessToken = (req,res,next) =>{
    let {token} =req.query;
    if(token === "accessApp"){
        return next();
    }
    return res.send("ACCESS DENIED")
}

app.get("/",accessToken,(req,res)=>{
    res.redirect("/chats")
})

// index route

app.get("/chats",wrapAsync(async (req,res) => {
    let chats = await Chat.find();
    res.render("index.ejs",{chats});
}));

// new- async err route
app.get("/chats/:id",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let chat = await Chat.findById(id);
    if(!chat){
        return next(new ExpressError(404,'Chat not found'));
    }
    res.render("edit.ejs",{chat})
}));

// new route 
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

// new route - post method
app.post("/chats",(req,res)=>{
    let {from , to , msg} =req.body;
    let newChat = new Chat({
        from : from,
        to: to,
        msg : msg,
        created_at : new Date(),
    })
    newChat.save().then(res => {
        console.log("new chat added successfully ")
    }).catch(err => console.log(err));

    res.redirect("/chats")
})

// edit route
app.get("/chats/:id/edit", wrapAsync( async(req,res)=>{
    let {id} =req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat});
    console.log(chat);
}));

//update route
app.put("/chats/:id", wrapAsync(async(req,res)=>{
    let {id} =req.params;
    let {msg : msg} =req.body;
    let updateChat = await Chat.findByIdAndUpdate(id,{msg : msg} ,{new :true}, {runValidator: true});
    res.redirect("/chats")
}));

// delete route 
app.delete("/chats/:id", wrapAsync(async(req,res)=>{
    let {id} =req.params;
    let deleteChat = await Chat.findByIdAndDelete(id);
    console.log(deleteChat);
    res.redirect('/chats')
}));


// error handler
app.use((err,req,res,next)=>{
    let {status=500,message="Some Error"}=err;
    res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log("app is listing at post 8080");
})