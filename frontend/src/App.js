import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { load_UserProfile } from "./actions/userAction";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CricketBallLoader from "./component/layouts/loader/Loader";
import PrivateRoute from "./component/Route/PrivateRoute";
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./App.css";

// Components
import Header from "./component/layouts/Header1.jsx/Header";
import Payment from "./component/Cart/Payment";
import Home from "./component/Home/Home";
import Services from "./Terms&Condtions/Service";
import Footer from "./component/layouts/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Signup from "./component/User/SignUp";
import Login from "./component/User/Login";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgetPassword from "./component/User/ForgetPassword";
import ResetPassword from "./component/User/ResetPassword";
import Shipping from "./component/Cart/Shipping";
import Cart from "./component/Cart/Cart";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrder from "./component/order/MyOrder";
import ContactForm from "./Terms&Condtions/Contact";
import AboutUsPage from "./Terms&Condtions/Aboutus";
import ReturnPolicyPage from "./Terms&Condtions/Return";
import TermsUse from "./Terms&Condtions/TermsAndUse";
import TermsAndConditions from "./Terms&Condtions/TermsCondtion";
import PrivacyPolicy from "./Terms&Condtions/Privacy";

// Admin Components (Lazy Loading)
const LazyDashboard = React.lazy(() => import("./component/Admin/Dashboard"));
const LazyProductList = React.lazy(() => import("./component/Admin/ProductList"));
const LazyOrderList = React.lazy(() => import("./component/Admin/OrderList"));
const LazyUserList = React.lazy(() => import("./component/Admin/UserList"));
const LazyUpdateProduct = React.lazy(() => import("./component/Admin/UpdateProduct"));
const LazyProcessOrder = React.lazy(() => import("./component/Admin/ProcessOrder"));
const LazyUpdateUser = React.lazy(() => import("./component/Admin/UpdateUser"));
const LazyNewProduct = React.lazy(() => import("./component/Admin/NewProduct"));
const LazyProductReviews = React.lazy(() => import("./component/Admin/ProductReviews"));

// --- IMPORTANT: Global Axios Configuration ---
// Idhu dhaan login cookies-ai ella request-layum backend-uku anupa help pannum
axios.defaults.withCredentials = true;

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("pk_test_51T9jExJwp4hWB7oKBa55SdIiRrXLHX117D78RkaAycAJUXTu6E1ePHaf8Uovi3KvVqKHEC9IguZv4VGPkvFCrP44001MRnyLaf");

  const dispatch = useDispatch();

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("https://cricketstore.onrender.com/api/v1/stripeapikey");
      
      if (data.stripeApiKey) {
        sessionStorage.setItem("stripeApiKey", data.stripeApiKey);
        setStripeApiKey(data.stripeApiKey);
      }
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
    }
  }

  useEffect(() => {
    // Page load aagum podhu user details-ai backend-la irundhu edukkum
    dispatch(load_UserProfile());
    
    const savedKey = sessionStorage.getItem("stripeApiKey");
    if (savedKey) {
      setStripeApiKey(savedKey);
    } else {
      getStripeApiKey();
    }
  }, [dispatch]);

  return (
    <>
      <Router>
        <SpeedInsights />
        <Header />
        <Switch>
          {/* Public Routes */}
          <Route exact path="/" component={Home} />
          <Route exact path="/product/:id" component={ProductDetails} />
          <Route exact path="/products" component={Products} />
          <Route path="/products/:keyword" component={Products} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/password/forgot" component={ForgetPassword} />
          <Route exact path="/password/reset/:token" component={ResetPassword} />
          <Route exact path="/cart" component={Cart} />
          
          {/* Information & Policy Routes */}
          <Route exact path="/policy/return" component={ReturnPolicyPage} />
          <Route exact path="/policy/Terms" component={TermsUse} />
          <Route exact path="/policy/privacy" component={PrivacyPolicy} />
          <Route exact path="/terms/conditions" component={TermsAndConditions} />
          <Route exact path="/contact" component={ContactForm} />
          <Route exact path="/about_us" component={AboutUsPage} />

          {/* User Private Routes */}
          <PrivateRoute exact path="/account" component={Profile} />
          <PrivateRoute exact path="/profile/update" component={UpdateProfile} />
          <PrivateRoute exact path="/password/update" component={UpdatePassword} />
          <PrivateRoute exact path="/orders" component={MyOrder} />
          <PrivateRoute exact path="/shipping" component={Shipping} />
          <PrivateRoute exact path="/order/confirm" component={ConfirmOrder} />
          <PrivateRoute exact path="/success" component={OrderSuccess} />

          {/* Payment Route */}
          {stripeApiKey && (
            <Route exact path="/process/payment">
              <Elements stripe={loadStripe(stripeApiKey)}>
                <PrivateRoute exact path="/process/payment" component={Payment} />
              </Elements>
            </Route>
          )}
        </Switch>

        {/* Admin Dashboard Routes */}
        <Suspense fallback={<CricketBallLoader />}>
          <Switch>
            <PrivateRoute isAdmin={true} exact path="/admin/dashboard" component={LazyDashboard} />
            <PrivateRoute isAdmin={true} exact path="/admin/products" component={LazyProductList} />
            <PrivateRoute isAdmin={true} exact path="/admin/product/:id" component={LazyUpdateProduct} />
            <PrivateRoute isAdmin={true} exact path="/admin/reviews" component={LazyProductReviews} />
            <PrivateRoute isAdmin={true} exact path="/admin/orders" component={LazyOrderList} />
            <PrivateRoute isAdmin={true} exact path="/admin/order/:id" component={LazyProcessOrder} />
            <PrivateRoute isAdmin={true} exact path="/admin/new/product" component={LazyNewProduct} />
            <PrivateRoute isAdmin={true} exact path="/admin/users" component={LazyUserList} />
            <PrivateRoute isAdmin={true} exact path="/admin/user/:id" component={LazyUpdateUser} />
          </Switch>
        </Suspense>

        <Services />
        <Footer />
      </Router>
    </>
  );
}

export default App;