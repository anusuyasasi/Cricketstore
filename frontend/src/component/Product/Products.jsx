import React, { useEffect } from "react";
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
  let keyword = match.params.keyword;
  const dispatch = useDispatch();
  const alert = useAlert();

  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
    filteredProductCount, // இதை Backend-ல் இருந்து பெறுவதை உறுதி செய்யவும்
  } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [price, setPrice] = React.useState([0, 100000]);
  const [category, setCategory] = React.useState("");
  const [ratings, setRatings] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedRating, setSelectedRating] = React.useState("all");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, ratings, category, alert, error]);

  const setCurrentPageNoHandler = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const handleCategoryChange = (category) => {
    setCategory(category === selectedCategory ? "" : category); // Toggle category
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1); // Filter மாறும்போது முதல் பக்கத்திற்கு செல்லவும்
  };

  const handleRatingChange = (event) => {
    setRatings(event.target.value);
    setSelectedRating(event.target.value);
    setCurrentPage(1);
  };

  // Pagination-க்கான கவுண்ட் (பில்டர் செய்யப்பட்டிருந்தால் அதன் எண்ணிக்கையை எடுக்கவும்)
  let count = filteredProductCount !== undefined ? filteredProductCount : productsCount;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="PRODUCTS --Ecart" />
          
          {/* Product Not Found Logic */}
          {!products || products.length === 0 ? (
            <div
              className="emptyCartContainer"
              style={{ marginTop: "5rem", background: "white" }}
            >
              <InventoryIcon className="cartIcon" />
              <Typography variant="h5" component="h1" className="cartHeading">
                Product Not Found
              </Typography>
              <Typography variant="body1" className="cartText">
                Nothin' to see here.
              </Typography>
              <Typography variant="body1" className="cartText">
                There is no product with this criteria.
              </Typography>
              <Button
                className="shopNowButton"
                onClick={() => window.location.reload()}
                style={{ width: "7rem", marginTop: "1rem" }}
              >
                Refresh
              </Button>
            </div>
          ) : (
            <div className="productPage">
              <div className="prodcutPageTop">
                <div className="filterBox">
                  {/* Price Filter */}
                  <div className="priceFilter">
                    <Typography className="filterHeading">Price</Typography>
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
                    <Typography className="filterHeading">Categories</Typography>
                    <ul className="categoryBox">
                      {categories.map((cat, index) => (
                        <li className="category-link" key={index}>
                          <label className="category-label">
                            <input
                              type="checkbox"
                              className="category-checkbox"
                              checked={cat === selectedCategory}
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
                    <Typography className="filterHeading">Ratings Above</Typography>
                    <RadioGroup
                      value={selectedRating}
                      onChange={handleRatingChange}
                      className="ratingsBox"
                    >
                      <FormControlLabel value="4" control={<Radio />} label="4★ & above" />
                      <FormControlLabel value="3" control={<Radio />} label="3★ & above" />
                      <FormControlLabel value="2" control={<Radio />} label="2★ & above" />
                      <FormControlLabel value="0" control={<Radio />} label="All" />
                    </RadioGroup>
                  </div>
                </div>

                {/* Product Display Grid */}
                <div className={products.length < 3 ? "products1" : "products"}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>

              {/* Pagination Box */}
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
          )}
        </>
      )}
    </>
  );
}

export default Products;