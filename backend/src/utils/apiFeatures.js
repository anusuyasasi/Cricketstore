class ApiFeatures {
  // query ==> Product.find()
  // queryString ==> req.query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1. Search logic
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // 2. Filter logic (Category, Price, Ratings)
  filter() {
    const queryCopy = { ...this.queryString };

    // Removing fields that are handled separately
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Advanced Filter for Price and Rating (gt, gte, lt, lte)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // Parse back to JSON and apply to query
    const parsedQuery = JSON.parse(queryStr);
    
    // Safety check: Filter-la empty objects or empty price fields irundha ignore panna
    this.query = this.query.find(parsedQuery);

    return this;
  }

  // 3. Pagination logic
  Pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;