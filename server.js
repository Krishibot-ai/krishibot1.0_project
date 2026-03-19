const express = require("express")
const fs = require("fs")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
app.use(express.static("public"))

function loadDB(){
return JSON.parse(fs.readFileSync("farmers.json"))
}

function saveDB(data){
fs.writeFileSync("farmers.json",JSON.stringify(data,null,2))
}

function checkLimit(phone){

let db=loadDB()

let user=db.users.find(u=>u.phone===phone)

if(!user){
user={phone:phone,questions:0,premium:false}
db.users.push(user)
}

if(!user.premium && user.questions>=5){
return {allowed:false,reply:"Free limit khatam. Premium ₹49/month lein."}
}

user.questions+=1

saveDB(db)

return {allowed:true}
}

function simpleAI(text){
text=text.toLowerCase()

if(text.includes("धान"))
return "धान ke liye nitrogen, phosphorus aur potash ka santulit upyog karein."

if(text.includes("कीट") || text.includes("kit"))
return "Neem oil spray ya recommended pesticide ka upyog karein."

return "KrishiBot: Kripya fasal, rog ya kheti sambandhit sawaal puchiye."
}

app.post("/chat",(req,res)=>{

let phone=req.body.phone
let msg=req.body.message

let check=checkLimit(phone)

if(!check.allowed){
return res.json({reply:check.reply})
}

let answer=simpleAI(msg)

res.json({reply:answer})

})

app.listen(3000,()=>{
console.log("KrishiBot server running")
})
