const express = require("express");
const app = express();
const store = require("../controller/store");
const multer = require("multer");
const path = require("path"); // Include the path module
const fs = require("fs");
const { spawn } = require("child_process");
const Product = require("../models/Product");
const Purchase = require("../models/purchase");

// const path = require('path');
// const fs = require('fs');
// const { PythonShell } = require('python-shell');

// Add Store
app.post("/add", store.addStore);
app.get("/update/:id", store.UpdateStore);

app.post("/update/user", store.updateFinal);
app.post("/delete/user", store.deleteStore);
// Get All Store
app.get("/get/:userID", store.getAllStores);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, __dirname); // Store the file in the same directory as the server script
//     },
//     filename: (req, file, cb) => {
//         cb(null, 'bill.pdf'); // Set the filename to 'bill.pdf'
//     }
// });
// const upload = multer({ storage: storage });

// // Define the directory where the Python model resides
// const pythonModelDir = __dirname;

// app.post("/add/pdffile",upload.single('file'),(req,res)=>{

//     const uploadedFileBuffer = req.file.buffer;
//     const uploadedFilePath = path.join(__dirname, 'bill.pdf');
//     // Write the uploaded file buffer to a file in the server directory with the name 'bill.pdf'
//     fs.writeFileSync(uploadedFilePath, uploadedFileBuffer);

//     const pythonProcess = spawn('python', ['model.py', 'bill.pdf'], { cwd: pythonModelDir });

//     // Capture the output from the Python model
//     let output = '';
//     pythonProcess.stdout.on('data', (data) => {
//         output += data.toString();
//     });

//     // Handle errors
//     pythonProcess.on('error', (error) => {
//         console.error('Error executing Python model:', error);
//         res.status(500).json({ success: false, message: 'Error executing Python model.' });
//     });

//     // When the Python process exits
//     pythonProcess.on('exit', (code) => {
//         // Remove the uploaded file from the server directory
//         fs.unlinkSync(uploadedFilePath);

//         if (code === 0) {
//             try {
//                 // Parse the JSON output from the Python model
//                 const jsonData = JSON.parse(output);
//                 // Send the JSON data back as the response
//                 res.status(200).json(jsonData);
//             } catch (error) {
//                 console.error('Error parsing JSON:', error);
//                 res.status(500).json({ success: false, message: 'Error parsing JSON output.' });
//             }
//         } else {
//             // If the Python model exits with an error, return an error response
//             console.error(`Python model exited with code ${code}`);
//             res.status(500).json({ success: false, message: 'Error executing Python model.' });
//         }
//     });

//     console.log('PDF file:', req.file);

// //    res.status(200).send("hello")

//  })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname); // Store the file in the same directory as the server script
  },
  filename: (req, file, cb) => {
    cb(null, "bill.pdf"); // Set the filename to 'bill.pdf'
  },
});

const upload = multer({ storage: storage });

// const pythonModelDir = __dirname;

//   all about adding

async function checkProductExistence(name) {
  try {
    // Check if the product exists in the database
    const product = await Product.findOne({ name });

    if (product) {
      return { exists: true, product };
    } else {
      return { exists: false };
    }
  } catch (error) {
    return { exists: false, error };
  }
}

async function updateProductStockAndAddPurchase(
  name,
  quantityToAdd,
  purchaseDetails,
  id
) {

    try {
        // Check if the product exists in the database
        let product = await Product.findOne({ name });

      

        
        
        if (!product) {
            
            // If product doesn't exist, create a new product
            product = new Product({
                userID:id,
                name:name,
                HSN: purchaseDetails['HSN/SAC'], // Assuming HSN is included in purchaseDetails
                stock:  purchaseDetails.Quantity,
                description: purchaseDetails.Unit // Assuming product description is included in purchaseDetails
            });
            product = await product.save();
            
       
            
        } else {
            // If product exists, update the stock quantity
            product = await Product.findByIdAndUpdate(product._id, { $inc: { stock: parseInt(quantityToAdd) } }, { new: true });
        }





try {
    

        // Create a new purchase record
        const purchase =await  new Purchase({
            userID: id, // userid
            ProductID: product._id,
            QuantityPurchased: parseInt(product.stock),
            PurchaseDate: JSON.stringify(new Date()),
            TotalPurchaseAmount: parseInt(purchaseDetails['Taxable Amount'])
        });
        await purchase.save();
} catch (error) {

    console.log("store 163")
    
}

        return { success: true, productId: product._id, updatedProduct: product, purchase };
    } catch (error) {

        
        return { success: false, error };
    }
}
//------------

app.post("/add/pdffile", upload.single("file"), async (req, res) => {
    // console.log("hello aman")
    // console.log(req.body.userID)
  const uploadedFilePath = req.file.path; // Path to the uploaded PDF file

  const pythonProcess = spawn("python", ["pdf2json.py", uploadedFilePath]);

  let output = "";
  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.on("error", (error) => {
    console.error("Error executing Python model:", error);
    res
      .status(500)
      .json({ success: false, message: "Error executing Python model." });
  });

  pythonProcess.on("exit", (code) => {
    if (code === 0) {
      try {
        const jsonData = JSON.parse(output);
        // console.log(jsonData);

    jsonData.forEach((element, i) => {
          
console.log("dfdfdfdjfkdfjkdjfkdjfkjfkdjfkdjfkdjf")

    updateProductStockAndAddPurchase(element["Item Name"], element.Quantity, element,req.body.userID)
    .then(result => {
        if (result.success) {
            console.log(`Stock quantity for product '${productName}' increased by ${quantityToAdd}.`);
            console.log('Product ID:', result.productId);
            console.log('Updated Product:', result.updatedProduct);
            console.log('Purchase Record:', result.purchase);
        } else {
            console.log("ni hua");
        }
    })
    .catch(error => console.error(error));
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res
          .status(500)
          .json({ success: false, message: "Error parsing JSON output." });
      }
    } else {
      console.error(`Python model exited with code ${code}`);
      res
        .status(500)
        .json({ success: false, message: "Error executing Python model." });
    }
  });
});

module.exports = app;
