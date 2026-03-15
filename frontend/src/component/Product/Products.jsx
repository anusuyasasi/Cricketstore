import React, { useEffect, useState } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layouts/loader/Loader";
import ProductCard from "../Home/ProductCard";
import MetaData from "../layouts/MataData/MataData";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { Typography, Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";

const categories = [
  "Cricket Kits",
  "Batting Gloves",
  "Batting Pads",
  "Bats",
  "Bags",
  "Helmets",
  "Balls",
  "Stumps",
  "Shoes",
  "Clothing",
  "Accessories",
];

function Products() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { keyword } = useParams();

  // Local States
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
    filteredProductCount,
  } = useSelector((state) => state.products);

  const setCurrentPageNoHandler = (e) => {
    setCurrentPage(e);
  };

  // இது ஸ்லைடரை நகர்த்தும் போது ஸ்டேட்டை மட்டும் மாற்றும்
  const handlePriceChange = (event, newPrice) => {
    setPrice(newPrice);
  };

  // இது ஸ்லைடரை நகர்த்தி முடித்த பிறகு API-ஐ அழைக்கும்
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
    setCurrentPage(1);
  };

  const handleCategoryChange = (selectedCat) => {
    setCategory(selectedCat);
    setCurrentPage(1);
  };

  const handleRatingChange = (event) => {
    setRatings(Number(event.target.value));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPrice([0, 100000]);
    setCategory("");
    setRatings(0);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword || "", currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error, alert]);

  // Pagination-க்கு தேவையான எண்ணிக்கை
  let count = filteredProductCount;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="PRODUCTS -- CricketWeapon" />
          <div className="productPage">
            <div className="prodcutPageTop">
              
              {/* Filters Section */}
              <div className="filterBox">
                <Typography variant="h6" className="filterHeading">Price</Typography>
                <div className="priceSlider">
                  <Slider
                    value={price}
                    onChange={handlePriceChange} // Immediate UI update
                    onChangeCommitted={priceHandler} // API Call on release
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={100000}
                    step={500}
                  />
                </div>

                <div className="filter_divider"></div>

                <Typography variant="h6" className="filterHeading">Categories</Typography>
                <ul className="categoryBox">
                  {categories.map((cat) => (
                    <li 
                      className={`category-link ${category === cat ? "activeCategory" : ""}`} 
                      key={cat} 
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>

                <div className="filter_divider"></div>

                <Typography variant="h6" className="filterHeading">Ratings Above</Typography>
                <RadioGroup value={ratings.toString()} onChange={handleRatingChange} className="ratingsBox">
                  <FormControlLabel value="4" control={<Radio size="small" />} label="4★ & above" />
                  <FormControlLabel value="3" control={<Radio size="small" />} label="3★ & above" />
                  <FormControlLabel value="2" control={<Radio size="small" />} label="2★ & above" />
                  <FormControlLabel value="0" control={<Radio size="small" />} label="All Ratings" />
                </RadioGroup>

                <div className="filter_divider"></div>
                <Button 
                  variant="outlined" 
                  color="error" 
                  fullWidth 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>

              {/* Products Display Section */}
              <div className="productsContainer">
                {products && products.length > 0 ? (
                  <div className={products.length < 2 ? "products1" : "products"}>
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="emptyCartContainer" style={{ background: "white", width: "100%" }}>
                    <InventoryIcon className="cartIcon" />
                    <Typography variant="h5" className="cartHeading">Product Not Found</Typography>
                    <Typography variant="body1" className="cartText">சரியான முடிவுகள் கிடைக்கவில்லை.</Typography>
                    <Button
                      className="shopNowButton"
                      onClick={clearFilters}
                      style={{ marginTop: "1rem", backgroundColor: "#eb4034", color: "white" }}
                    >
                      View All Products
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Section */}
            {resultPerPage < count && (
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNoHandler}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="First"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Products;