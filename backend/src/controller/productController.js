const ProductModel = require("../model/ProductModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// >>>>>>>>>>>>>>>>>>>>> createProduct Admin route >>>>>>>>>>>>>>>>>>>>>>>>
exports.createProduct = asyncWrapper(async (req, res) => {
    let images = [];

    if (req.body.images) {
        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        const imagesLinks = [];
        const chunkSize = 3;
        const imageChunks = [];
        
        let tempImages = [...images];
        while (tempImages.length > 0) {
            imageChunks.push(tempImages.splice(0, chunkSize));
        }

        for (let chunk of imageChunks) {
            const uploadPromises = chunk.map((img) =>
                cloudinary.v2.uploader.upload(img, {
                    folder: "Products",
                })
            );

            const results = await Promise.all(uploadPromises);

            for (let result of results) {
                imagesLinks.push({
                    product_id: result.public_id,
                    url: result.secure_url,
                });
            }
        }

        req.body.user = req.user.id;
        req.body.images = imagesLinks;
    }

    const data = await ProductModel.create(req.body);

    res.status(200).json({ success: true, data: data });
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> GET ALL PRODUCTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getAllProducts = asyncWrapper(async (req, res) => {
    const resultPerPage = 8;
    const productsCount = await ProductModel.countDocuments();
const products = await ProductModel.find();
    // 1. Prepare Features
    const apiFeature = new ApiFeatures(products, req.query)
        .search()
        .filter();

    // 2. Get filtered products count before pagination
    let products = await apiFeature.query;
    let filteredProductCount = products.length;

    // 3. Apply Pagination (Use lowercase 'pagination' to match the class method)
    apiFeature.pagination(resultPerPage);

    // 4. Final execution using .clone()
    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductCount,
    });
});

// >>>>>>>>>>>>>>>>>>>>>>> GET ALL PRODUCTS (ADMIN) >>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getAllProductsAdmin = asyncWrapper(async (req, res) => {
    const products = await ProductModel.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// >>>>>>>>>>>>>>>>>>>>>>> UPDATE PRODUCT (ADMIN) >>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.updateProduct = asyncWrapper(async (req, res, next) => {
    let product = await ProductModel.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    if (req.body.images !== undefined) {
        let images = [];

        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].product_id);
        }

        const imagesLinks = [];
        for (let img of images) {
            const result = await cloudinary.v2.uploader.upload(img, {
                folder: "Products",
            });

            imagesLinks.push({
                product_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// >>>>>>>>>>>>>>>>>>>>>>> DELETE PRODUCT (ADMIN) >>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.deleteProduct = asyncWrapper(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].product_id);
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});

// >>>>>>>>>>>>>>>>>>>>>>> GET PRODUCT DETAILS >>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getProductDetails = asyncWrapper(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        Product: product, // To match your frontend expectation
    });
});

// >>>>>>>>>>>>>>>>>>>>>>> CREATE/UPDATE REVIEW >>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.createProductReview = asyncWrapper(async (req, res, next) => {
    const { ratings, comment, productId, title, recommend } = req.body;

    const review = {
        userId: req.user._id,
        name: req.user.name,
        ratings: Number(ratings),
        title,
        comment,
        recommend,
        avatar: req.user.avatar.url,
    };

    const product = await ProductModel.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.userId.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.userId.toString() === req.user._id.toString()) {
                rev.ratings = ratings;
                rev.comment = comment;
                rev.recommend = recommend;
                rev.title = title;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.ratings;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// >>>>>>>>>>>>>>>>>>>>>>> GET ALL REVIEWS >>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getProductReviews = asyncWrapper(async (req, res, next) => {
    const product = await ProductModel.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// >>>>>>>>>>>>>>>>>>>>>>> DELETE REVIEW >>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.deleteReview = asyncWrapper(async (req, res, next) => {
    const product = await ProductModel.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.ratings;
    });

    let ratings = reviews.length === 0 ? 0 : avg / reviews.length;
    const numOfReviews = reviews.length;

    await ProductModel.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});