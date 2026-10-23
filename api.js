
const serverless = require("serverless-http");
const app = require("../../app");
const connectDB = require("../../db");

const proxy = serverless(app);

exports.handler = async (event, context) => {
  try {
    await connectDB();
    return await proxy(event, context);
  } catch (error) {
    console.error("Netlify function error:", error);
    return {
      statusCode: 500,
      body: "Server error"
    };
  }
};
