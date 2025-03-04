const express = require("express");
const cloudinary = require("../utils/cloudinary");
const Product = require("../models/product");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

// CREATE
router.post("/", isAdmin, async (req, res) => {
  const { name, brand, desc, price, image, fullDesc } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "online-shop",
      });

      if (uploadRes) {
        const product = new Product({
          name,
          brand,
          desc,
          price,
          image: uploadRes || null,
          fullDesc: fullDesc || {},
        });

        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
});

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE PRODUCT
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json("Product Not Found");
    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );
      if (destroyResponse) {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedProduct);
      }
    } else {
      console.log("Action Terminated. Failed To Deleted Product Image");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// // EDIT PRODUCT
// router.put("/:id", isAdmin, async (req, res) => {
//   if (req.body.productImg) {
//     try {
//       const destroyResponse = await cloudinary.uploader.destroy(
//         req.body.product.image.public_id
//       );
//       if (destroyResponse) {
//         const uploadedResponse = await cloudinary.uploader.upload(
//           req.body.productImg,
//           {
//             upload_preset: "online-shop",
//           }
//         );

//         if (uploadedResponse) {
//           const updatedProduct = await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//               $set: {
//                 ...req.body.product,
//                 image: uploadedResponse,
//               },
//             },
//             { new: true }
//           );
//           res.status(200).json(updatedProduct);
//         }
//       }
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } else {
//     try {
//       const updatedProduct = await Product.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body.product,
//         },
//         { new: true }
//       );
//       res.status(200).json(updatedProduct);
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   }
// });

// EDIT PRODUCT
router.put("/:id", isAdmin, async (req, res) => {
  const { productImg, product } = req.body;

  try {
    let updatedProductData = { ...product };

    if (productImg) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );
      if (destroyResponse) {
        const uploadedResponse = await cloudinary.uploader.upload(productImg, {
          upload_preset: "online-shop",
        });

        if (uploadedResponse) {
          updatedProductData.image = uploadedResponse;
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: updatedProductData,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
