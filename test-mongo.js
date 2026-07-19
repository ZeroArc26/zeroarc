const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://zeroarc:ZeroArc2026@ac-4unctqr-shard-00-00.muzpjcr.mongodb.net:27017,ac-4unctqr-shard-00-01.muzpjcr.mongodb.net:27017,ac-4unctqr-shard-00-02.muzpjcr.mongodb.net:27017/?ssl=true&replicaSet=atlas-tbee3w-shard-0&authSource=admin&appName=ZEROARC"
  )
  .then(() => {
    console.log("✅ Connected");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌", err);
    process.exit(1);
  });