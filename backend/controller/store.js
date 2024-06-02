const Store = require("../models/store");

// Add Store
const addStore = async (req, res) => {
    console.log(req.body)
  const addStore = await  Store({
    userID : req.body.userId,
    name: req.body.name,
    category: req.body.category,
    address: req.body.address,
    credit: req.body.credit,
    gstnumber:req.body.gstnumber,
    MobileNo:req.body.MobileNo
  });

  addStore.save().then((result) => {

      res.status(200).send(result);
    })
    .catch((err) => {
      console.log("error aya hai")
      console.log(err)
      res.status(402).send(err);
    });
};

// Get All Stores
const getAllStores = async (req, res) => {
  const findAllStores = await Store.find({"userID": req.params.userID}).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllStores);
};


const UpdateStore=async(req,res)=>{

const tobeupdated=await Store.find({"_id":req.params.id})
res.status(200).send(tobeupdated)
}


const updateFinal=(req,res)=>{
  console.log(req.body)
  Store.findByIdAndUpdate(req.body._id, req.body, { new: true }) // { new: true } returns the updated document
  .then(updatedDocument => {
    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(updatedDocument); // Send back the updated document
  })
  .catch(error => {
    res.status(500).json({ error: error.message });
  });
}


const deleteStore=async(req,res)=>{

console.log(req.body)
Store.findByIdAndDelete(req.body.id)
.then(deletedUser => {
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'User deleted successfully', deletedUser });
})
.catch(error => {
  res.status(500).json({ error: error.message });
});





}


module.exports = { addStore, getAllStores,UpdateStore,updateFinal,deleteStore };
