class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1. தேடல் (Search)
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

  // 2. பில்டர் (Filter) - மிக முக்கியமாக மாற்றப்பட்ட பகுதி
  filter() {
    const queryCopy = { ...this.queryString };

    // தேவையில்லாத பீல்டுகளை நீக்குதல்
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Price & Ratings பில்டர்
    let queryStr = JSON.stringify(queryCopy);
    
    // gt, gte போன்றவற்றை $gt, $gte என மாற்றுதல்
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // JSON ஆக மாற்றுதல்
    const queryObj = JSON.parse(queryStr);

    // முக்கிய திருத்தம்: விலையை நம்பராக மாற்றுதல் (சில சமயம் String ஆக இருந்தால் பில்டர் 0 காட்டும்)
    if (queryObj.price) {
      if (queryObj.price.$gte) queryObj.price.$gte = Number(queryObj.price.$gte);
      if (queryObj.price.$lte) queryObj.price.$lte = Number(queryObj.price.$lte);
    }
    
    if (queryObj.ratings) {
      if (queryObj.ratings.$gte) queryObj.ratings.$gte = Number(queryObj.ratings.$gte);
    }

    this.query = this.query.find(queryObj);
    return this;
  }

  // 3. பக்கங்கள் (Pagination)
  Pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;