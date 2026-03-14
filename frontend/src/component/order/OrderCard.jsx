import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ReplayIcon from "@mui/icons-material/Replay";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { addItemToCart } from "../../actions/cartAction";
import { cancelOrder, myOrders } from "../../actions/orderAction"; // Cancel action-ai import seiyavum
import { useHistory } from "react-router-dom";
import DialogBox from "../Product/DialogBox";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "1rem",
  },
  orderCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 8,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease-in-out",
    marginBottom: "2rem",
    "&:hover": {
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  firstBlock: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderBottom: "1px solid #eee",
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
  },
  rightSide: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  orderId: {
    fontWeight: "bold",
    color: "#555",
    fontSize: "0.85rem",
  },
  secondBlock: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1.5rem 1rem",
  },
  productDetailsContainer: {
    display: "flex",
    gap: "2rem",
    alignItems: "flex-start",
  },
  productImage: {
    width: "120px",
    height: "120px",
    objectFit: "contain",
  },
  buttonsContainer: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
    flexWrap: "wrap",
  },
  buyAgainButton: {
    backgroundColor: "rgb(37, 37, 37) !important",
    color: "#fff !important",
    "&:hover": { backgroundColor: "#ed1c24 !important" },
  },
  cancelButton: {
    borderColor: "#d32f2f !important",
    color: "#d32f2f !important",
    "&:hover": { backgroundColor: "#fdecea !important" },
  },
  trackButton: {
    borderColor: "#1976d2 !important",
    color: "#1976d2 !important",
    "&:hover": { backgroundColor: "#e3f2fd !important" },
  },
  addressBlock: {
    width: "250px",
    borderLeft: "1px solid #eee",
    paddingLeft: "1.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    secondBlock: { flexDirection: "column", gap: "2rem" },
    addressBlock: { width: "100%", borderLeft: "none", paddingLeft: 0 },
    productDetailsContainer: { flexDirection: "column", alignItems: "center" },
  },
}));

const createdAtFormatted = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
};

const OrderCard = ({ item, user }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const isSmallScreen = useMediaQuery("(max-width: 999px)");
  const { shippingInfo, orderItems } = item;

  const addToCartHandler = (id, qty = 1) => {
    dispatch(addItemToCart(id, qty));
    alert.success("Item Added to Cart");
    history.push("/cart");
  };

  const cancelOrderHandler = async (id) => {
    const success = await dispatch(cancelOrder(id));
    if (success) {
      alert.success("Order Cancelled Successfully");
      dispatch(myOrders()); // List-ai update seiya
    } else {
      alert.error("Could not cancel order");
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.orderCard}>
        {/* Top Header Section */}
        <div className={classes.firstBlock}>
          <div className={classes.leftSide}>
            <Typography variant="caption" style={{ fontWeight: "bold" }}>ORDER PLACED</Typography>
            <Typography variant="body2">{createdAtFormatted(item.createdAt)}</Typography>
            <Typography className={classes.orderId}>ID: #{item._id}</Typography>
          </div>
          <div className={classes.rightSide}>
            <Typography variant="caption" style={{ fontWeight: "bold" }}>TOTAL PRICE</Typography>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>₹{item.totalPrice}</Typography>
          </div>
        </div>

        {/* Order Items */}
        {orderItems.map((product) => (
          <div key={product.productId}>
            <div className={classes.secondBlock}>
              <div className={classes.productDetailsContainer}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={classes.productImage}
                />
                <div>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>{product.name}</Typography>
                  <Typography variant="body2"><strong>QTY:</strong> {product.quantity}</Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong>{" "}
                    <span style={{ color: item.orderStatus === "Delivered" ? "green" : item.orderStatus === "Cancelled" ? "red" : "orange" }}>
                      {item.orderStatus}
                    </span>
                  </Typography>

                  <div className={classes.buttonsContainer}>
                    <Button
                      variant="contained"
                      size="small"
                      className={classes.buyAgainButton}
                      onClick={() => addToCartHandler(product.productId)}
                    >
                      <ReplayIcon fontSize="small" style={{ marginRight: "5px" }} /> Buy Again
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.trackButton}
                      onClick={() => history.push(`/order/${item._id}`)}
                    >
                      <LocalShippingIcon fontSize="small" style={{ marginRight: "5px" }} /> Track
                    </Button>

                    {item.orderStatus === "Processing" && (
                      <Button
                        variant="outlined"
                        size="small"
                        className={classes.cancelButton}
                        onClick={() => cancelOrderHandler(item._id)}
                      >
                        <CancelIcon fontSize="small" style={{ marginRight: "5px" }} /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {!isSmallScreen && (
                <div className={classes.addressBlock}>
                  <Typography variant="subtitle2" style={{ fontWeight: "bold" }}>Ship To:</Typography>
                  <Typography variant="body2">{user.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {shippingInfo.address}, {shippingInfo.city},<br />
                    {shippingInfo.state} - {shippingInfo.pinCode}
                  </Typography>
                </div>
              )}
            </div>

            <Divider style={{ margin: "0 1rem" }} />

            <div style={{ padding: "1rem" }}>
              <Button
                variant="text"
                startIcon={<EditIcon />}
                onClick={() => setOpen(true)}
                style={{ color: "#252525", textTransform: "none" }}
              >
                Write A Product Review
              </Button>
            </div>

            <DialogBox
              open={open}
              handleClose={() => setOpen(false)}
              id={product.productId}
            />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default OrderCard;