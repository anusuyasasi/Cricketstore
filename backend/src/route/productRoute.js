const express = require("express");
const router = express.Router();

const { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductDetails, 
    getProductReviews, 
    deleteReview, 
    createProductReview, 
    getAllProductsAdmin 
} = require("../controller/productController");

const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

// >>>>>>>>>>>>>>>>>>>>> Public Routes >>>>>>>>>>>>>>>>>>>>>>>>

// FIXED: /product-ai /products-nu maathi iruken (Frontend-la irundhu vara request match aaga)
router.route("/products").get(getAllProducts);

router.route("/product/:id").get(getProductDetails);

// >>>>>>>>>>>>>>>>>>>>> Review Routes >>>>>>>>>>>>>>>>>>>>>>>>

// Review create/update panna
router.route("/review").put(isAuthentictedUser, createProductReview);

// Oru product-oda ella review-vum paarkka mattrum admin review delete panna
router.route("/reviews")
    .get(getProductReviews)
    .delete(isAuthentictedUser, deleteReview);

// >>>>>>>>>>>>>>>>>>>>> Admin Routes >>>>>>>>>>>>>>>>>>>>>>>>

router.route("/admin/products").get(isAuthentictedUser, authorizeRoles("admin"), getAllProductsAdmin);

router.route("/admin/product/new").post(isAuthentictedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id")
    .put(isAuthentictedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthentictedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;