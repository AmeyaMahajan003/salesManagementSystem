const mongoose = require("mongoose");
const uri = "mongodb+srv://neelasmahajan003:Neelas003Sagar@cluster420.pibeufq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster420";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };