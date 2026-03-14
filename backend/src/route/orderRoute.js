const express = require("express");
const { 
    newOrder, 
    getSingleOrder, 
    myOrders, 
    getAllOrders, 
    updateOrder, 
    deleteOrder,
    cancelOrder // Controller-la irundhu cancelOrder-ai import pannanum
} = require("../controller/orderController");

const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");
const router = express.Router();

// >>>>>>>>>>>>>>>   User Routes   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// 1. New Order create panna
router.route("/order/new").post(isAuthentictedUser, newOrder);

// 2. Logged in user-oda orders (My Orders)
router.route("/orders/me").get(isAuthentictedUser, myOrders);

// 3. Order-ai cancel panna (User side status update)
// Order ID-ai vechu status-ai 'Cancelled'-nu maatha PUT method use panrom
router.route("/order/cancel/:id").put(isAuthentictedUser, cancelOrder);

// 4. Single order details edukka (Track Order details inga irundhu edukka padum)
router.route("/order/:id").get(isAuthentictedUser, getSingleOrder);


// >>>>>>>>>>>>>>>   Admin Routes   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// 5. Admin ellaa orders-aiyum paarkka
router.route("/admin/orders").get(isAuthentictedUser, authorizeRoles("admin"), getAllOrders);

// 6. Admin order status update panna matrum order-ai delete panna
router.route("/admin/order/:id")
    .put(isAuthentictedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthentictedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;