class ApiFeatures {
  // query ==> Product.find()
  // queryString ==> req.query (keyword, page, price, category போன்றவை)
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1. தேடல் வசதி (Search feature)
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i", // எழுத்துக்களின் அளவு (Case insensitive) பார்க்காது
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // 2. பில்டர் வசதி (Filter for Category, Price, Ratings)
  filter() {
    const queryCopy = { ...this.queryString };

    // இந்த பீல்டுகளை பில்டரில் இருந்து நீக்க வேண்டும் (இவை பில்டர் கிடையாது)
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Price மற்றும் Ratings-க்கான அட்வான்ஸ் பில்டர் (gt, gte, lt, lte)
    let queryStr = JSON.stringify(queryCopy);
    
    // Regular Expression மூலம் gt, gte போன்றவற்றை $gt, $gte என மாற்றுகிறோம்
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 3. பக்கங்கள் பிரித்தல் (Pagination)
  Pagination(resultPerPage) {
    // தற்போதைய பக்கம் (Default ஆக 1)
    const currentPage = Number(this.queryString.page) || 1;

    // எத்தனை தயாரிப்புகளைத் தவிர்க்க வேண்டும் (Skip calculation)
    // உதாரணம்: பக்கம் 2-ல் இருந்தால், முதல் பக்கத்தின் 8 தயாரிப்புகளைத் தவிர்க்கும்
    const skip = resultPerPage * (currentPage - 1);

    // Mongoose-ன் limit மற்றும் skip மூலம் டேட்டாவை எடுக்கும்
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;