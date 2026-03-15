const asyncWrapper = require("../middleWare/asyncWrapper");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthentictedUser = asyncWrapper(async (req, res, next) => {
    // 1. Cookies-ல் இருந்து டோக்கனை எடுக்கிறோம்
    const { token } = req.cookies;

    // டோக்கன் இல்லை என்றால் 401 எரர்
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    try {
        // 2. டோக்கனை செக்ரெட் கீ கொண்டு வெரிஃபை செய்கிறோம்
        const deCodeToken = jwt.verify(token, process.env.JWT_SECRET);

        // 3. யூசர் ஐடியை வைத்து டேட்டாபேஸில் தேடுகிறோம்
        // ஒருவேளை யூசர் டெலீட் செய்யப்பட்டிருந்தால் எரர் வரும், அதைத் தடுக்க இது உதவும்
        const user = await userModel.findById(deCodeToken.id);

        if (!user) {
            return next(new ErrorHandler("User not found with this ID", 401));
        }

        // 4. ரிக்வெஸ்ட்டில் யூசர் டேட்டாவைச் சேர்க்கிறோம்
        req.user = user;

        next();
    } catch (error) {
        // டோக்கன் எக்ஸ்பயரி (Expired) அல்லது தவறான டோக்கன் என்றால்
        return next(new ErrorHandler("Json Web Token is invalid or expired. Try again.", 401));
    }
});

// Roles அனுமதி சரிபார்க்கும் செயல்பாடு
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // ஒருவேளை லாகின் ஆகாமல் இந்த ரூட்டை அணுகினால் req.user இருக்காது
        if (!req.user) {
            return next(new ErrorHandler("Please login to access this resource", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }

        next();
    };
};