const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
// Ensure the path to your userModel is correct based on your folder structure
const userModel = require("./model/userModel"); 

// Config environment variables
dotenv.config({ path: "backend/config/config.env" });

// Create Admin Function
const createAdmin = async () => {
    try {
        // Use your specific env variable name from your config.env
        const dbUri = process.env.MONGO_URI || process.env.DB_LINK;
        
        await mongoose.connect(dbUri);
        console.log("Connected to Database for Admin creation...");

        // Validation: Check if admin already exists
        const existing = await userModel.findOne({
            email: process.env.ADMIN_EMAIL,
        });

        if (existing) {
            console.log("Admin already exists with this email.");
            process.exit();
        }

        // Hash Password
        // Note: Default salt rounds is usually 10 if env is missing
        const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
        const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds);

        // Create Admin User
        await userModel.create({
            name: "Admin",
            email: process.env.ADMIN_EMAIL,
            password: hashed,
            avatar: {
                public_id: "admin_avatar",
                url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
            },
            role: "admin",
        });

        console.log("✅ Admin account created successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();