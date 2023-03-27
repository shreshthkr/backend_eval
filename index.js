const express=require("express");
const {connection} = require("./db");
const {userRouter} = require("./routes/user.routes");
require("dotenv").config();
const cors=require("cors");
const { postRouter } = require("./routes/post.routes");
const { authentication } = require("./middleware/auth.middleware");
const app=express();
app.use(cors());
app.use(express.json());
app.use("/users", userRouter)
app.use(authentication);
app.use("/posts", postRouter)


app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("Connected to the DB")
    } catch (err) {
        console.log("Cannot connect to the DB")
        console.log(err)
    }
    console.log(`Server is running on port ${process.env.port}`)
})

