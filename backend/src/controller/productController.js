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
    
    const tempImages = [...images];
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> get all product >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getAllProducts = asyncWrapper(async (req, res) => {
  const resultPerPage = 8;
  const productsCount = await ProductModel.countDocuments();

  // 1. Search mattrum Filter apply seiyavum
  const apiFeature = new ApiFeatures(ProductModel.find(), req.query)
    .search()
    .filter();

  // 2. Pagination apply seiyum munnadi filtered count edukka clone() seiyavum
  // Idhu thaan unga frontend-la products show aagaamal irundha mukhya prachanaiyai solve pannum
  let products = await apiFeature.query.clone(); 
  let filteredProductCount = products.length;

  // 3. Ippo Pagination apply seiyavum
  apiFeature.Pagination(resultPerPage);

  // 4. Final results fetch seiyavum
  products = await apiFeature.query;

  res.status(200).json({ 
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductCount,
  });
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> get all product admin route >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getAllProductsAdmin = asyncWrapper(async (req, res) => {
  const products = await ProductModel.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// >>>>>>>>>>>>>>>>>> Update Admin Route >>>>>>>>>>>>>>>>>>>>>>>
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

    // Deleting existing images
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>> delete product --admin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

// >>>>>>>>>>>>>>>>>>>>>>> Details of product >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getProductDetails = asyncWrapper(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// >>>>>>>>>>>>> Create/Update Review >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
        rev.title = title;
        rev.recommend = recommend;
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

// >>>>>>>>>>>>>>>>>>>>>> Get All Reviews >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

// >>>>>>>>>>>>>>>>>>>>>> Delete Review >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

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