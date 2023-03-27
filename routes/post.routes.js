const express=require("express");
const postRouter=express.Router();
const {PostModel}=require("../model/post.model");
const jwt=require("jsonwebtoken");

postRouter.post("/add", async(req,res)=>{
    try {
        const post= new PostModel(req.body)
        await post.save();
        res.status(200).send({"msg": "A post has been added successfully"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})


postRouter.get("/", async (req,res)=>{
  
    const token=req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "masai")
   
    try {
        if(decoded){
            const posts = await PostModel.find({"userID": decoded.userID})
            res.status(200).send(posts)
        }else{
            res.status(400).send({"msg": "User has not posted anything"})
        }
    } catch (err) {
        res.status(400).send({"msg":err.message})
    }



})




postRouter.patch("/update/:postID", async(req,res)=>{
    const payload=req.body;
    const postID = req.params.postID
    try {
        await PostModel.findByIdAndUpdate({_id:postID},payload)
        res.status(200).send({"msg":"Post has been Updated Successfully"})
    } catch (error) {
        res.status(400).send({"msg": error.message})
    }
})


postRouter.patch("/delete/:postID", async(req,res)=>{
   const token=req.headers.authorization.split(" ")[1]
   const decoded=jwt.verify(token, "masai")
    const postID = req.params.postID
    const req_id= decoded.userID
    const post = PostModel.findOne({_id:postID})
    const userID_in_post= post.userID
    try {
        if(req_id ===userID_in_post ){
            await PostModel.findByIdAndDelete({_id:postID})
            res.status(200).send({"msg":"Post has been Deleted Successfully"})
        }else{
        res.status(400).send({"msg": "You are not authorized to delete the post"})

        }
        
    } catch (error) {
        res.status(400).send({"msg": error.message})
    }
})


module.exports={postRouter}