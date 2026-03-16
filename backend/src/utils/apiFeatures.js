// utils/ApiFeatures.js

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const { keyword } = this.queryString;

    if (keyword) {
      this.query = this.query.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      });
    }

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };

    const excludedFields = ["keyword", "page", "limit"];
    excludedFields.forEach((field) => delete queryCopy[field]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.skip(skip).limit(resultPerPage);

    return this;
  }
}

module.exports = ApiFeatures;