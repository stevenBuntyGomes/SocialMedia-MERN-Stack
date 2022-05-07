const Post = require('../models/Post');
const User = require('../models/User');
const { post } = require('../routes/post');
const cloudinary = require('cloudinary');

exports.createPost = async(req, res) => {
    try{

        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "posts"
        });
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            owner: req.user._id,
        }
        const post = await Post.create(newPostData);
        const user = await User.findById(req.user._id);


        user.posts.unshift(post._id);
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: "post created",
            post,
        });
    }catch(err){
        res.status(500).json({success: false, message: error.message});
    }
}


exports.deletePost = async (req, res) => {
    try{
        let post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "post not found",
            });
        }

        if(post.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await cloudinary.v2.uploader.destroy(post.image.public_id);

        await post.remove();


        const user = await User.findById(req.user._id);
        
        const index = user.posts.indexOf(req.params.id);

        user.posts.splice(index, 1);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "post deleted",
        });

    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.likeAndUnlikePost = async(req, res) => {
    try {
        
        let post = await Post.findById(req.params.id);


        if(!post){
            return res.status(404).json({
                success: false,
                message: "post not found",
            });
        }

        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();
            const updatedPost = await Post.findById(req.params.id).populate("owner likes comments.user");
            return res.status(200).json({
                success: true,
                message: "post unliked",
                post: updatedPost,
            });
        }else{
            post.likes.push(req.user._id);

            await post.save();

            const updatedPost = await Post.findById(req.params.id).populate("owner likes comments.user");
            return res.status(200).json({
                success: true,
                message: "post liked",
                post: updatedPost,
            });
        }

        

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



// single post update controller
exports.singlePostUpdate = async (req, res) => {
    try{
        let post = await Post.findById(req.body.id).populate("owner likes comments.user");


        if(!post){
            return res.status(404).json({
                success: false,
                message: "post not found",
            });
        }
        return res.status(200).json({
            success: true,
            post: post,
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.getPostsOfFollowing = async (req, res) => {
    try{
        // const user = await User.findById(req.user._id).populate("following", "posts");
        const user = await User.findById(req.user._id);
        const following = user.following;
        const followers = user.followers;
        const userArray = [req.user._id];
        const getConnectedPosts = following.concat(followers, userArray);
        
        const posts = await Post.find({
            owner: {
                $in: getConnectedPosts,
            }
        }).populate("owner likes comments.user");
        return res.status(200).json({
            success: true,
            posts: posts.reverse(),
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.updateCaption = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            res.status(404).json({
                success: false,
                message: "post not found",
            });
        }

        if(post.owner.toString() !== req.user._id.toString()){
            res.status(501).json({
                success: false,
                message: "unauthorized",
            });
        }

        post.caption = req.body.caption;
        await post.save();

        res.status(200).json({
            success: true,
            message: "post updated",
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.addCommentsOnPost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            res.status(404).json({
                success: false,
                message: "post not found..",
            });
        }

        let commentIndex = -1; 
        post.comments.forEach((item, index) => {
            if(item.user.toString() === req.user._id.toString()){
                commentIndex = index;
            }
        });

        if(commentIndex !== -1){
            post.comments[commentIndex].comment = req.body.comment;
            await post.save();
        }else{
            post.comments.push({
                user: req.user._id,
                comment: req.body.comment,
            });
        }

        await post.save();

        const postAfterComment = await Post.findById(req.params.id).populate("owner likes comments.user");
        if(!postAfterComment){
            res.status(404).json({
                success: false,
                message: "post not found..",  
            });
        }


        return res.status(200).json({
            success: true,
            message: "comment added",
            post: postAfterComment,
        });

        
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.deleteComment = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            res.status(404).json({
                success: false,
                message: "post not found",
            });
        }

        if(post.owner.toString() === req.user._id.toString()){
            if(req.body.commentId == undefined){
                return res.status(400).json({
                    success: false,
                    message: "comment id required",
                });
            }
            post.comments.forEach((item, index) => {
                if(item._id.toString() === req.body.commentId.toString()){
                    return post.comments.splice(index, 1);
                }
            });
            await post.save();
            const updatedPost = await Post.findById(req.params.id).populate("owner likes comments.user");;

            res.status(200).json({
                success: true,
                message: "comment deleted...",
                post: updatedPost,
            });
            
        }else{
            // 1 2 3 4
            post.comments.forEach((item, index) => {
                if(item.user.toString() === req.user._id.toString()){
                    return post.comments.splice(index, 1);
                }
            });

            await post.save();
            const updatedPost = await Post.findById(req.params.id).populate("owner likes comments.user");;

            res.status(200).json({
                success: true,
                message: "comment deleted...",
                post: updatedPost,
            });
        }
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// getMyPosts for user

exports.getMyPosts = async (req, res) => {
    try{
        const users = await User.findById(req.user._id);
        const posts = [];
        
        for(let i = 0; i < users.posts.length; i++){
            const post = await Post.findById(users.posts[i]).populate('likes comments.user owner');
            posts.push(post);
        }
        // const users = await User.find({}).populate("posts");
        res.status(200).json({
            success: true,
            posts,
            userId: req.user._id,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
} 