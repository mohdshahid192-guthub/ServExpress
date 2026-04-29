import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";



const app = express();

app.use(cors({
  origin: `${process.env.CORS_ORIGIN}`,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


import userRouter from "./routes/user.route.js"
import orderRouter from "./routes/order.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/orders", orderRouter)



export {app}