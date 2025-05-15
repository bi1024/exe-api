import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./lib/db.js";

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
});
