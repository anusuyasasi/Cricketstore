class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    // FIXED: Keyword "undefined" string-ah vandhaalum adhai empty-ah treat pannum
    const keyword =
      this.queryString.keyword && this.queryString.keyword !== "undefined"
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

  filter() {
    const queryCopy = { ...this.queryString };

    // Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    const parsedQuery = JSON.parse(queryStr);

    // FIXED: Category empty string-ah irundhaalum, illai "undefined" nu vandhaalum remove pannanum
    if (parsedQuery.category === "" || parsedQuery.category === "undefined") {
      delete parsedQuery.category;
    }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  Pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;

    // skip = resultPerPage * (page - 1)
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;