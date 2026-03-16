class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.filterConditions = {};
  }

  search() {
    const { search } = this.queryString;

    if (search) {
      this.filterConditions.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    return this;
  }

  filter() {
    const { priceMin, priceMax, ratingMin } = this.queryString;

    if (priceMin || priceMax) {
      this.filterConditions.price = {};
      if (priceMin) this.filterConditions.price.$gte = Number(priceMin);
      if (priceMax) this.filterConditions.price.$lte = Number(priceMax);
    }

    if (ratingMin) {
      this.filterConditions.ratings = { $gte: Number(ratingMin) };
    }

    this.query = this.query.find(this.filterConditions);

    return this;
  }

  pagination() {
    const currentPage = Number(this.queryString.page) || 1;
    const resultPerPage = Number(this.queryString.limit) || 10;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.skip(skip).limit(resultPerPage);

    return this;
  }
}

module.exports = ApiFeatures;