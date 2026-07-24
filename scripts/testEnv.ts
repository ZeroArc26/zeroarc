import dotenv from "dotenv";

const result = dotenv.config({ path: ".env.local" });

console.log(result);
console.log(process.env.MONGODB_URI);