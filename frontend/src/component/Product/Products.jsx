import React, { useEffect, useState } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import { useRouteMatch } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InventoryIcon from "@mui/icons-material/Inventory";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const alert = useAlert();

  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  // Redux Store Data
  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
    filteredProductCount,
  } = useSelector((state) => state.products);

  // FIXED: keyword logic
  const keyword = match.params.keyword || "";

  const setCurrentPageNoHandler = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
    setCurrentPage(1); // Filter maathuna page 1-ku poganum
  };

  const handleCategoryChange = (cat) => {
    if (category === cat) {
      setCategory("");
    } else {
      setCategory(cat);
    }
    setCurrentPage(1);
  };

  const handleRatingChange = (event) => {
    setRatings(Number(event.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  // Logic to decide pagination visibility
  let count = filteredProductCount;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="PRODUCTS --Ecart" />
          <h2 className="productsHeading">Products</h2>

          <div className="productPage">
            <div className="prodcutPageTop">
              <div className="filterBox">
                {/* Price Filter */}
                <div className="priceFilter">
                  <Typography style={{ fontSize: "18px", padding: "5px", fontWeight: 700, color: "#414141" }}>
                    Price
                  </Typography>
                  <div className="priceSlider">
                    <Slider
                      value={price}
                      onChange={priceHandler}
                      min={0}
                      max={100000}
                      step={100}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                    />
                  </div>
                  <div className="priceSelectors">
                    <div className="priceSelector">
                      <Select
                        value={price[0]}
                        onChange={(e) => setPrice([+e.target.value, price[1]])}
                        className="priceOption"
                        IconComponent={ArrowDropDownIcon}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={5000}>5000</MenuItem>
                        <MenuItem value={10000}>10000</MenuItem>
                      </Select>
                      <span className="toText">to</span>
                      <Select
                        value={price[1]}
                        onChange={(e) => setPrice([price[0], +e.target.value])}
                        className="priceOption"
                        IconComponent={ArrowDropDownIcon}
                      >
                        <MenuItem value={20000}>20000</MenuItem>
                        <MenuItem value={50000}>50000</MenuItem>
                        <MenuItem value={100000}>100000</MenuItem>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="filter_divider"></div>

                {/* Categories Filter */}
                <div className="categoriesFilter">
                  <Typography style={{ fontSize: "18px", padding: "10px", fontWeight: 700, color: "#414141" }}>
                    Categories
                  </Typography>
                  <ul className="categoryBox">
                    {categories.map((cat, index) => (
                      <li className="category-link" key={index}>
                        <label htmlFor={`category-${index}`} className="category-label">
                          <input
                            type="checkbox"
                            id={`category-${index}`}
                            className="category-checkbox"
                            value={cat}
                            checked={cat === category}
                            onChange={() => handleCategoryChange(cat)}
                          />
                          {cat}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="filter_divider"></div>

                {/* Ratings Filter */}
                <div className="ratingsFilter">
                  <Typography style={{ fontSize: "18px", padding: "10px", fontWeight: 700, color: "#414141" }}>
                    Ratings Above
                  </Typography>
                  <RadioGroup value={String(ratings)} onChange={handleRatingChange} className="ratingsBox">
                    <FormControlLabel value="4" control={<Radio />} label="4★ & above" />
                    <FormControlLabel value="3" control={<Radio />} label="3★ & above" />
                    <FormControlLabel value="2" control={<Radio />} label="2★ & above" />
                    <FormControlLabel value="0" control={<Radio />} label="All" />
                  </RadioGroup>
                </div>
              </div>

              {/* Products Display Section */}
              <div className="rightSide">
                {products && products.length === 0 ? (
                  <div className="emptyCartContainer" style={{ background: "white" }}>
                    <InventoryIcon className="cartIcon" />
                    <Typography variant="h5" className="cartHeading">Product Not Found</Typography>
                    <Typography className="cartText">Nothin' to see here.</Typography>
                    <Button className="shopNowButton" onClick={() => window.location.reload()}>Refresh</Button>
                  </div>
                ) : (
                  <div className={products && products.length < 2 ? "products1" : "products"}>
                    {products && products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination logic */}
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