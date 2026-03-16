exports.ProductQuery = (queryParams) => {
  const { search, priceMin, priceMax, avgRating } = queryParams;

  const query = {};

  if (search) {
    query.category = search;
  }

  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }

  if (avgRating) {
    query.ratings = { $gte: Number(avgRating) };
  }

  return query;
};

exports.getPagination = (page = 1, limit = 10) => {
  const currentPage = Number(page);
  const resultPerPage = Number(limit);

  const skip = (currentPage - 1) * resultPerPage;

  return {
    currentPage,
    resultPerPage,
    skip,
  };
};

exports.getProductMeta = (
  productsCount,
  filteredProductsCount,
  currentPage,
  resultPerPage,
) => {
  return {
    totalProducts: productsCount,
    filteredProducts: filteredProductsCount,
    resultPerPage,
    currentPage,
    totalPages: Math.ceil(filteredProductsCount / resultPerPage),
  };
};