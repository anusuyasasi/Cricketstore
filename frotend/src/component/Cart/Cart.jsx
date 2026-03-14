import React, { useState, useEffect } from "react";
import "./Cart.css";
import TextField from "@material-ui/core/TextField";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link, useHistory } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import CartItem from "./CartItem";

// IMPORT THE IMAGE AT THE TOP
import paymentIconsImg from "../../Image/cart/cart_img.png";

import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) return;
    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) return;
    dispatch(addItemToCart(id, newQty));
  };

  const handleApplyCoupon = () => {
    // Basic logic: if empty, show invalid
    if (couponCode.trim() === "") {
      setIsValid(false);
    } else {
      setIsValid(true);
      // Logic for actual coupon validation goes here
    }
  };

  const handleFocus = (event) => {
    setIsFocused(event.target.value !== "");
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=/shipping");
  };

  // Calculate prices
  let totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  let discountedPrice = generateDiscountedPrice(totalPrice);
  let totalDiscount = totalPrice - discountedPrice;
  let finalPrice = totalPrice - totalDiscount;

  // Format for display
  const formattedFinal = dispalyMoney(finalPrice);
  const formattedDiscount = dispalyMoney(totalDiscount);
  const formattedTotal = dispalyMoney(totalPrice);

  return (
    <>
      <div className="cartPage">
        <MetaData title="Your Cart" />
        <div className="cart_HeaderTop">
          <div className="headerLeft">
            <Typography variant="h5" component="h1" className="cartHeading">
              Shopping Cart
            </Typography>
            <Typography variant="body2" className="cartText3">
              TOTAL ({cartItems.length} {cartItems.length === 1 ? "item" : "items"}) <b>{formattedFinal}</b>
            </Typography>
          </div>
          <Typography
            variant="body2"
            className="cartText2"
            onClick={() => history.push("/products")}
            style={{ cursor: "pointer" }}
          >
            Continue Shopping
          </Typography>
        </div>

        <div className="separator_cart2"></div>

        {cartItems.length === 0 ? (
          <div className="emptyCartContainer">
            <RemoveShoppingCartIcon className="cartIcon" />
            <Typography variant="h5" component="h1" className="cartHeading">
              Your Shopping Cart is Empty
            </Typography>
            <Typography variant="body1" className="cartText">
              Nothin' to see here. Let's get shopping!
            </Typography>
            <Link to="/products" style={{ textDecoration: "none" }}>
              <Button className="shopNowButton">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="cart_content_wrapper">
            <div className="cart_left_container">
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  deleteCartItems={deleteCartItems}
                  decreaseQuantity={decreaseQuantity}
                  increaseQuantity={increaseQuantity}
                  length={cartItems.length}
                  id={item.productId}
                />
              ))}
            </div>

            <div className="separator_cart3"></div>

            <div className="cart_right_container">
              <div className="order_summary">
                <h4>
                  Order Summary &nbsp; ({cartItems.length}{" "}
                  {cartItems.length > 1 ? "items" : "item"})
                </h4>
                <div className="order_summary_details">
                  <div className="price order_Summary_Item">
                    <span>Original Price</span>
                    <p>{formattedTotal}</p>
                  </div>

                  <div className="discount order_Summary_Item">
                    <span>Discount</span>
                    <p><del>{formattedDiscount}</del></p>
                  </div>

                  <div className="delivery order_Summary_Item">
                    <span>Delivery</span>
                    <p><b>Free</b></p>
                  </div>

                  <div className="separator_cart"></div>
                  <div className="total_price order_Summary_Item">
                    <div>
                      <h4>Total Price</h4>
                      <p style={{ fontSize: "12px", color: "#414141" }}>
                        (Inclusive of all taxes)
                      </p>
                    </div>
                    <p><b>{formattedFinal}</b></p>
                  </div>
                </div>
              </div>

              <div className="separator"></div>

              <div className="coupon-box-wrapper">
                <div className={`coupon-box-content ${isFocused ? "focused" : ""}`}>
                  <TextField
                    label="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={() => setIsFocused(false)}
                    error={!isValid}
                    helperText={!isValid && "Invalid coupon code"}
                    variant="outlined"
                    size="small"
                    style={{ width: "200px", marginRight: "1rem" }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className="coupon-box-apply-btn"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Button
                variant="contained"
                className="btn-custom"
                onClick={checkoutHandler}
                fullWidth
              >
                Checkout
              </Button>

              <div className="paymentLogoImg">
                {/* USE THE IMPORTED VARIABLE HERE */}
                <img
                  src={paymentIconsImg}
                  alt="payment-icons"
                  className="paymentImg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;