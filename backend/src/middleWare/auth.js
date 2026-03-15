const asyncWrapper = require("../middleWare/asyncWrapper");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

// 1. பயனர் லாகின் செய்திருக்கிறாரா என்று சரிபார்க்கும் Middleware
exports.isAuthenticatedUser = asyncWrapper(async (req, res, next) => {
    // குக்கீஸில் இருந்து டோக்கனை எடுக்கிறோம்
    const { token } = req.cookies;

    // டோக்கன் இல்லை என்றால் பயனர் லாகின் செய்யவில்லை என்று அர்த்தம்
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    try {
        // டோக்கனை ரகசிய குறியீடு (JWT_SECRET) கொண்டு சரிபார்க்கிறோம்
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        // டோக்கனில் உள்ள ID-யைக் கொண்டு டேட்டாபேஸில் பயனரைத் தேடுகிறோம்
        req.user = await userModel.findById(decodedData.id);

        // ஒருவேளை பயனர் டேட்டாபேஸில் இல்லை என்றால்
        if (!req.user) {
            return next(new ErrorHandler("User not found", 401));
        }

        next();
    } catch (error) {
        // டோக்கன் செல்லாததாகவோ அல்லது காலம் முடிந்ததாகவோ இருந்தால்
        return next(new ErrorHandler("JSON Web Token is invalid. Try again.", 401));
    }
});

// 2. குறிப்பிட்ட ரோல் (Admin/User) உள்ளவர்கள் மட்டுமே அணுக அனுமதிக்கும் Middleware
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user இருக்கிறதா என்று உறுதி செய்கிறோம்
        if (!req.user) {
            return next(new ErrorHandler("User information not found. Please login again.", 401));
        }

        // அனுமதிக்கப்பட்ட ரோல்களில் பயனரின் ரோல் இல்லையென்றால் 403 (Forbidden) எரர்
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