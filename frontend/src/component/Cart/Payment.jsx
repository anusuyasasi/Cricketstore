import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layouts/MataData/MataData";
import { useAlert } from "react-alert";
import axios from "axios";
import { useHistory } from "react-router-dom";
import OrderDetailsSection from "./OrderDetails";
import DummyCard from "./DummyCard";
import { clearErrors, createOrder } from "../../actions/orderAction";
import CheckoutSteps from "./CheckoutSteps ";

// Vite-compatible Image Imports
import MasterCard from "../../Image/payment-svg/mastercard.svg";
import Visa from "../../Image/payment-svg/visa (1).svg";
import Paytm from "../../Image/payment-svg/paytm.svg";
import CartImg from "../../Image/cart/cart_img.png"; 

import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./Cart.css";
import {
  Typography,
  TextField,
  Grid,
  Radio,
  Button,
  Divider,
  Link,
} from "@material-ui/core";
import {
  CreditCard,
  CardMembership,
  Payment,
  Lock,
} from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import AssuredWorkloadOutlinedIcon from "@mui/icons-material/AssuredWorkloadOutlined";

import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const useStyles = makeStyles((theme) => ({
  payemntPage: {
    padding: "1rem 0",
    width: "100%",
    backgroundColor: "white",
    overflow : "hidden",
  },
  paymentPage__container: {
    display: "flex",
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
      alignItems: "center",
    },
  },
  PaymentBox: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      marginTop: "1rem",
      padding: "2rem",
    },
  },
  PaymentHeading: {
    fontWeight: "800",
    marginBottom: "1rem",
    fontSize: "1.5rem",
    textTransform: "uppercase",
  },
  securePayemnt: {
    display: "flex",
    alignItems: "center",
    fontWeight: "300",
    backgroundColor: "#f5f5f5 !important",
    width: "90%",
    padding: "1rem",
    gap: "0.8rem",
    marginBottom: "1rem",
    "& svg": {
      fontSize: "2rem",
    },
  },
  icons: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    width: "100%",
    "& img": {
      width: "40px",
      height: "auto",
      cursor: "pointer",
    },
  },
  cardContainer: {
    padding: "1rem",
    border: "1px solid #f5f5f5",
    borderRadius: "0.5rem",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
    width: "90%",
  },
  subHeading: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "500",
    marginBottom: "1rem",
    "& svg": {
      fontSize: "1.5rem",
    },
  },
  cardDetails: {
    width: "100%",
    "& .MuiGrid-item": {
      marginBottom: "0.5rem",
    },
  },
  labelText: {
    fontWeight: "300",
  },
  outlinedInput: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#000",
      },
      "&:hover fieldset": {
        borderColor: "#000",
      },
    },
  },
  placeOrderBtn: {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "500",
    fontSize: "1rem",
    padding: "0.8rem 1rem",
    borderRadius: "0.5rem",
    width: "90%",
    marginTop: "1rem",
    "&:hover": {
      backgroundColor: "#00000080",
    },
  },
  paymentInput: {
    width: "95%",
    padding: "18.5px 14px",
    border: "1px solid #000",
  },
  paymentInput2: {
    width: "90%",
    padding: "18.5px 14px",
    border: "1px solid #000",
  },
  inputIcon: {
    position: "absolute",
    top: "50%",
    right: "1rem",
    transform: "translateY(-50%)",
    color: "#00000080",
    zIndex: 1,
  },
  cardNumberInput: { position: "relative" },
  expiryInput: { position: "relative" },
  cvvInput: { position: "relative" },
  payemntAmount: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    width: "40%",
    [theme.breakpoints.down("sm")]: { width: "90%" },
  },
  shipping_Address: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  boldDivider: { margin: "20px 0", width: "100%" },
}));

const PaymentComponent = () => {
  const classes = useStyles();
  const history = useHistory();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { error } = useSelector((state) => state.newOrder);

  const [isFocused, setIsFocused] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showDummyCard, setShowDummyCard] = useState(false);

  const subTotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleNameOnCardChange = (e) => setNameOnCard(e.target.value);
  const handleApplyCoupon = () => setIsValid(false);
  const handleFocus = (event) => setIsFocused(event.target.value !== "");
  const handleRadioChange = () => setShowDummyCard(!showDummyCard);
  const handleCloseDummyCard = () => setShowDummyCard(false);

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country || "India"}`;

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: subTotal,
    shippingPrice: 0,
    totalPrice: subTotal,
  };

  async function paymentSubmitHandler(e) {
    e.preventDefault();
    if (nameOnCard.trim() === "") return alert.error("Please enter name on card");
    if (!stripe || !elements) return alert.error("Stripe not loaded");

    try {
      const config = { headers: { "Content-Type": "application/json" } };
const { data } = await axios.post(
  "https://cricketstore.onrender.com/api/v1/payment/process", 
  { amount: Math.round(subTotal * 100) }, 
  { 
    headers: { "Content-Type": "application/json" },
    withCredentials: true // இந்த வரியை இங்கே சேர்க்கவும்
  }
);      const client_secret = data.client_secret;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: { line1: shippingInfo.address, state: shippingInfo.state, postal_code: shippingInfo.pinCode, country: "IN" },
          },
        },
      });

      if (result.error) {
        alert.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        order.paymentInfo = { id: result.paymentIntent.id, status: result.paymentIntent.status };
        dispatch(createOrder(order));
        history.push("/success");
      }
    } catch (err) {
      alert.error(err.response?.data?.message || "Payment Failed");
    }
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  let totalPrice = subTotal;
  let discountedPrice = generateDiscountedPrice(totalPrice);
  let totalDiscount = totalPrice - discountedPrice;
  let final = dispalyMoney(totalPrice - totalDiscount);

  return (
    <div className={classes.payemntPage}>
      <CheckoutSteps activeStep={2} />
      <MetaData title={"Payment"} />
      <div className={classes.paymentPage__container}>
        <div className={classes.PaymentBox}>
          <Typography variant="h5" className={classes.PaymentHeading}>Payment method</Typography>
          <Typography variant="subtitle2" className={classes.securePayemnt}>
            <AssuredWorkloadOutlinedIcon /> Payments are SSL encrypted.
          </Typography>

          <div className={classes.cardContainer}>
            <Typography variant="h6" className={classes.subHeading}>Credit Card <CreditCard /></Typography>
            <Grid container spacing={2} className={classes.cardDetails}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Card number</Typography>
                <div className={classes.cardNumberInput}>
                  <CardMembership className={classes.inputIcon} />
                  <CardNumberElement className={classes.paymentInput} />
                </div>
              </Grid>
              <Grid item xs={12} className={classes.icons}>
                 <img src={MasterCard} alt="Mastercard" />
                 <img src={Visa} alt="Visa" />
                 <img src={Paytm} alt="Paytm" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">EXPIRY DATE</Typography>
                <div className={classes.expiryInput}>
                  <Payment className={classes.inputIcon} />
                  <CardExpiryElement className={classes.paymentInput2} />
                </div>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">CVV</Typography>
                <div className={classes.cvvInput}>
                  <Lock className={classes.inputIcon} />
                  <CardCvcElement className={classes.paymentInput2} />
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField label="NAME ON CARD" variant="outlined" fullWidth value={nameOnCard} onChange={handleNameOnCardChange} />
              </Grid>
            </Grid>
          </div>

          <div className={classes.cardSelection}>
            <Radio checked={showDummyCard} onChange={handleRadioChange} />
            <Typography variant="subtitle2">Use dummy card</Typography>
            {showDummyCard && <DummyCard onClose={handleCloseDummyCard} />}
          </div>

          <Button variant="contained" className={classes.placeOrderBtn} onClick={paymentSubmitHandler} style={{marginTop: "2rem"}}>
            Place Order {final}
          </Button>
        </div>

        <div className={classes.payemntAmount}>
           <div className="paymentLogoImg">
              <img src={CartImg} alt="payment-icons" style={{width: '100%'}} />
           </div>
           {/* Summary items go here mapping cartItems */}
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;