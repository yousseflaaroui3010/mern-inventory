module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/inventory",
  jwtSecret: process.env.JWT_SECRET || "votre_secret_jwt"
};