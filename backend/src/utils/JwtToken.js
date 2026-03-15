// This method will take user Data, status code, and res 
// It creates a JWT Token, saves it in a cookie, and sends the response.

const sendJWtToken = (user, statusCode, res) => {
    // User model-ல் நாம் உருவாக்கிய getJWTToken() மெத்தட் மூலம் டோக்கனை உருவாக்குகிறோம்
    const token = user.getJWTToken();

    // Cookie எக்ஸ்பயரி நேரத்தை .env கோப்பில் இருந்து எடுக்கிறோம் (இல்லை என்றால் 7 நாட்கள் என எடுத்துக்கொள்ளும்)
    const cookieExpire = Number(process.env.COOKIE_EXPIRE) || 7;

    // Cookie-க்கான ஆப்ஷன்கள்
    const options = {
        expires: new Date(
            Date.now() + cookieExpire * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // இது XSS அட்டாக்கிலிருந்து குக்கீயைப் பாதுகாக்கும்

        // Render (Backend) மற்றும் Localhost (Frontend) என வெவ்வேறு இடங்களில் இருப்பதால் இவை கட்டாயம்:
        secure: true,   // HTTPS-ல் மட்டுமே குக்கீ வேலை செய்யும் (Render HTTPS என்பதால் இது அவசியம்)
        sameSite: "none", // Cross-site (Render to Localhost) ரிக்வெஸ்ட்டுகளுக்கு இது மிக முக்கியம்
    };

    // குக்கீயைச் சேமித்து JSON ரெஸ்பான்ஸை அனுப்புகிறோம்
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendJWtToken;