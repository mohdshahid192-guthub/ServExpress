import  dotenv  from "dotenv";
import connectDB from "./db/connection.db.js";
import { app } from "./app.js";
import cron from "node-cron"
import { Order } from "./models/orders.model.js";

dotenv.config({
  "path": "./env"
})


connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is listening at port: ${process.env.PORT}`);
    
    
  })
 
    cron.schedule("0 * * * *", async () => {
      const now = new Date();

      // 1. Delete requested orders after 6h
      await Order.deleteMany({ status: "requested" || "rejected", expiresAt: { $lte: now } });

      // 2. Mark expired pending orders as missed
      await Order.updateMany(
        { status: "pending", expiresAt: { $lte: now } },
        { $set: { status: "missed", cleanupAt: new Date(Date.now() + 28*24*60*60*1000) } }
      );

      // 3. Delete missed orders after 15 days
      await Order.deleteMany({ status: "missed", cleanupAt: { $lte: now } });

      console.log("Order cleanup job executed");
    });

})
.catch((err) => {
  console.log("Database connection error ", err);
  
})