module.exports = {
  mongoURI: process.env.MONGO_URI || "YOUR_MONGO_URI",
  sessionSecret: process.env.JWT_SECRET || "SECRET_WORD"
};