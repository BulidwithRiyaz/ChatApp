const mongoose = require('mongoose');
const Chat =require("./model/chat.js");


main().then(res => console.log("database connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');
};


let allChats = [
    {
      from: "Riyaz",
      to: "Apnacollege",
      msg: "Hi I am student of Apna College",
      created_at: new Date(),
    },
    {
      from: "Aman",
      to: "Rohit",
      msg: "Hello Rohit, excited to join the class",
      created_at: new Date(),
    },
    {
      from: "Sneha",
      to: "Neha",
      msg: "I just completed the first module",
      created_at: new Date(),
    },
    {
      from: "Ravi",
      to: "Aman",
      msg: "Can you explain closures in JavaScript?",
      created_at: new Date(),
    },
    {
      from: "Priya",
      to: "Karan",
      msg: "The DSA session was really helpful",
      created_at: new Date(),
    },
    {
      from: "Karan",
      to: "Priya",
      msg: "When is the next live session?",
      created_at: new Date(),
    },
    {
      from: "Neha",
      to: "Sneha",
      msg: "Project assignments are interesting",
      created_at: new Date(),
    },
    {
      from: "Sahil",
      to: "Riyaz",
      msg: "I need help with installing Node.js",
      created_at: new Date(),
    },
    {
      from: "Ananya",
      to: "Apnacollege",
      msg: "This course is boosting my confidence",
      created_at: new Date(),
    },
    {
      from: "Rohit",
      to: "Sahil",
      msg: "Looking forward to the next hackathon",
      created_at: new Date(),
    },
  ];

  
Chat.insertMany(allChats).then(res =>{
    console.log('data inserteed ', res)
}).catch(err => console.log(err));