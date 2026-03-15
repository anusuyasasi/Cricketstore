// this method will take user Data status code and res => Then Create Token and will saving in cookie and send

const sendJWtToken = (user, statusCode, res) => {
  const token = user.getJWTToken(); // every user has access all userModel methods

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // கீழே உள்ள இரண்டு வரிகள் மிக முக்கியம் (Render to Localhost connection-க்கு)
    secure: true,   // HTTPS வழியாக மட்டுமே குக்கீ வேலை செய்யும்
    sameSite: "none", // Cross-site request-க்கு இது கட்டாயம்
  };

  // wrapping all data into cookie eg token and options data
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendJWtToken;