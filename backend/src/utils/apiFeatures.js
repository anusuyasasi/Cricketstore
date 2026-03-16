class ApiFeatures {
  // query ==> Product.find()
  // queryString ==> req.query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1. Search Functionality
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i", // Case insensitive search
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // 2. Filter Functionality (Category, Price, Ratings)
  filter() {
    const queryCopy = { ...this.queryString };

    // அகற்று வேண்டிய புலங்கள் (Removing fields for category search)
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Price மற்றும் Rating-க்கான வடிகட்டி (Filter For Price and Rating)
    let queryStr = JSON.stringify(queryCopy);
    
    // gt, gte, lt, lte ஆகியவற்றை MongoDB ஆபரேட்டர்களாக ($gt) மாற்றுதல்
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 3. Pagination Functionality
  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;

    // எத்தனை பொருட்களைத் தவிர்க்க வேண்டும் (Skip calculation)
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;