const express =require("express");
const app = express();
const path =require("path");
const mongoose = require('mongoose');
const methodOverride =require("method-override");
const Chat =require("./model/chat.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");


app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); 


main().then(res => console.log("database connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');
}



// index route

app.get("/chats",async (req,res) => {
    let chats = await Chat.find();
    res.render("index.ejs",{chats});
})

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
app.get("/chats/:id/edit", async(req,res)=>{
    let {id} =req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat});
    console.log(chat);
})

//update route
app.put("/chats/:id", async(req,res)=>{
    let {id} =req.params;
    let {msg : msg} =req.body;
    let updateChat = await Chat.findByIdAndUpdate(id,{msg : msg} ,{new :true}, {runValidator: true});
    res.redirect("/chats")
})

// delete route 
app.delete("/chats/:id", async(req,res)=>{
    let {id} =req.params;
    let deleteChat = await Chat.findByIdAndDelete(id);
    console.log(deleteChat);
    res.redirect('/chats')
})

app.get("/",(req,res)=>{
    res.redirect("/chats")
})

app.listen(8080,()=>{
    console.log("app is listing at post 8080");
})