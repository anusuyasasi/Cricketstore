class ApiFeatures {
  // query ==> Product.find()
  // queryString ==> req.query (e.g., keyword, page, price)
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1. Search Logic
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i", // case insensitive search
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // 2. Filter Logic (Category, Price, Ratings)
  filter() {
    const queryCopy = { ...this.queryString };

    // Removing fields that shouldn't be part of the direct filter
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Advanced Filter for Price and Ratings (gt, gte, lt, lte)
    let queryStr = JSON.stringify(queryCopy);
    // Adding $ sign before gt, gte, lt, lte for MongoDB operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 3. Pagination Logic
  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    // limit: items per page, skip: items to ignore from previous pages
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;