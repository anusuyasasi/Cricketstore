import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  rootPayment: {
    width: "100%",
    display: "flex",
    gap: "2.5rem",
    padding: "1rem 0rem 1rem 0rem",
    borderBottom: "1px solid #eee", // Ovvoru product-kum separation-kaga
  },
  image: {
    width: "155px",
    height: "140px",
    objectFit: "contain", // Image full-ah theriya contain use panrom
    [theme.breakpoints.down(899)]: {
      width: "120px",
      height: "110px",
    },
  },
  details: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    fontWeight: "500",
    fontSize: "18px",
    marginBottom: theme.spacing(1),
  },
  quantity: {
    fontSize: 16,
    marginBottom: theme.spacing(1),
    color: "#00000080",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  finalPrice: {
    fontWeight: "bold", // Price konjam thookala theriya bold
    fontSize: 16,
    color: "#000",
  },
  discountPrice: {
    textDecoration: "line-through",
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2),
    fontSize: 16,
  },
  statusContainer: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },
  statusLabel: {
    fontWeight: 400,
    marginRight: "10px",
    color: "#00000080",
    fontSize: 16,
  },
  paymentStatus: {
    color: "green", // Payment eppodhumae Paid thaan (success naala)
    fontSize: 16,
  },
  trackingStatus: {
    fontSize: 16,
    fontWeight: "500",
  },
}));

// Inga 'orderStatus' props-ai add panniyullaen
const OrderDetailsSection = ({ item, totalDiscount, totalPrice, orderStatus }) => {
  const classes = useStyles();

  return (
    <div className={classes.rootPayment}>
      <img src={item.image} alt={item.name} className={classes.image} />
      
      <div className={classes.details}>
        <Typography variant="subtitle1" className={classes.productName}>
          {item.name}
        </Typography>

        <Typography variant="body2" className={classes.quantity}>
          <span className={classes.statusLabel}>Quantity:</span> {item.quantity}
        </Typography>

        <div className={classes.priceContainer}>
          <Typography variant="body2" className={classes.finalPrice}>
            ₹{totalPrice}
          </Typography>
          {totalDiscount && (
            <Typography variant="body2" className={classes.discountPrice}>
              ₹{totalDiscount}
            </Typography>
          )}
        </div>

        {/* Tracking Status Section */}
        <div className={classes.statusContainer}>
          <span className={classes.statusLabel}>Order Status:</span>
          <Typography 
            variant="body2" 
            className={classes.trackingStatus}
            style={{ 
              color: 
                orderStatus === "Delivered" ? "green" : 
                orderStatus === "Cancelled" ? "red" : "orange" 
            }}
          >
            {orderStatus}
          </Typography>
        </div>

        {/* Payment Status */}
        <div className={classes.statusContainer}>
          <span className={classes.statusLabel}>Payment:</span>
          <Typography variant="body2" className={classes.paymentStatus}>
            Paid
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsSection;