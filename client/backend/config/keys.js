// client/backend/config/keys.js
module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb+srv://yousseflaaroui1:mSL5RHKrvf67VmoI@cluster0.4xwma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  jwtSecret: process.env.JWT_SECRET || "votre_secret_jwt"
};