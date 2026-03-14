const asyncWrapper = require("../middleWare/asyncWrapper");
const orderModel = require("../model/orderModel");
const productModel = require("../model/ProductModel");
const ErrorHandler = require("../utils/errorHandler");

// >>>>>>>>>>>>>>>   Create New Order   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.newOrder = asyncWrapper(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderModel.create({  
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id, 
    paidtAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// >>>>>>>>>>>> Get Single Order (Tracking-ku idhu thaan use aagum) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getSingleOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate({ path: "user", select: "name email" });

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// >>>>>>>>>>>>>>>> Get Logged In User Orders >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.myOrders = asyncWrapper(async (req, res) => {
  const orders = await orderModel.find({ user: req.user._id }); 

  res.status(200).json({
    success: true,
    orders, 
  });
});

// >>>>>>>>>>>>>>>> Cancel Order (User Function) - PUTHUSA ADD PANNIYATHU >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.cancelOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  // Shipped aana order-aiyo Delivered aana order-aiyo cancel panna mudiyaathu
  if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Cannot cancel order once it is Shipped or Delivered", 400));
  }

  order.orderStatus = "Cancelled";
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order Cancelled Successfully",
  });
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>> Get All Orders (Admin) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getAllOrders = asyncWrapper(async (req, res, next) => {
  const orders = await orderModel.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// >>>>>>>>>>>>>>>>>>>>>>> Update Order Status (Admin) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.updateOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped"){
    order.orderItems.forEach(async (orderItem) => {
      await updateStock(orderItem.productId, orderItem.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (order.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Update Stock Function
async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  if (product) {
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
}

// >>>>>>>>>>>>>>>>>>>>> Delete Order (Admin) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.deleteOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with given Id", 400));
  }

  await order.deleteOne(); 

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});