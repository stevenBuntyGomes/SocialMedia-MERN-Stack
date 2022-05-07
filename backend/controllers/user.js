const { find } = require('../models/Post');
const Post = require('../models/Post');
const User = require('../models/User');
const sendEmail = require('../middlewares/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');


exports.register = async (req, res) => {
    try{
        const {name, email, password, avatar} = req.body;
        let user = await User.findOne({email}); 
        if(user){
            return res.status(400).json({success: false, message: "User alerady exists."});

        }
        // add image to register user
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "social_avatar"
        });

        user = await User.create({name, email, password, avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }});

        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now()+90*24*60*60*1000),
            httpOnly: true,            
        };
        // new populated user
        const newUser = await User.findById(user._id).populate('posts followers following');

        res.status(201).cookie("token", token, options).json({
            success: true,
            newUser,
            token,
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email}).select('+password').populate('posts followers following');
        if(!user){
            res.status(400).json({
                success: false,
                message: "user does not exist",
            });
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            res.status(400).json({
                success: false,
                message: "Incorrect Password",
            });
        }

        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now()+90*24*60*60*1000),
            httpOnly: true,            
        };

        res.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.followUser = async(req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        // return res.status(200).json({
        //     user: req.user,
        // });
        // console.log(userToFollow._id);
        // console.log(loggedInUser._id);
        
        if(!userToFollow){
            return res.status(404).json({
                success: false,
                message: "User not Found",
            });
        }
        if(!loggedInUser){
            return res.status(404).json({
                success: false,
                message: "logged in user not found",
            });
        }

        if(loggedInUser.following.includes(userToFollow._id)){
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
            const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id);
            
            loggedInUser.following.splice(indexFollowing, 1);
            userToFollow.followers.splice(indexFollowers, 1);

            await loggedInUser.save();
            await userToFollow.save();


            res.status(200).json({
                success: true,
                message: "user unfollowed",
            });
        }else{
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);


            await userToFollow.save();
            await loggedInUser.save();

            res.status(200).json({
                success: true,
                message: "user followed",
            });
        }


        

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// logout
exports.logout = async (req, res) => {
    try{
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()), 
            httpOnly: true,

        }).json({
            success: true,
            message: "Logged Out",
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// update user passwords 
exports.updatePassword = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('+password');
        const {oldPassword, newPassword, confirmPassword} = req.body;

        if(!oldPassword || !newPassword || !confirmPassword){
            res.status(400).json({
                success: false,
                message: "oldPassword, newPassword and confirmPassword field can not be empty..",
            });
        }

        const isMatch = await user.matchPassword(oldPassword);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "old password doesn't match..",
            });
        }

        if(oldPassword == newPassword){
            return res.status(400).json({
                success: false,
                message: "old password and new password can not be same..",
            });
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "new password and confirm password doesn't match..",
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "password changed..",
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.updateProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        const {name, email, avatar} = req.body;
        if(!name || !email){
            res.status(400).json({
                success: false,
                message: "name or email field can not be empty..",
            });
        }
        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }

        // user avatar todo
        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "social_avatar"
            });
            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "user updated",
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.deleteMyProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        let posts = user.posts;
        const followers = user.followers;
        const followings = user.following;
        const userId = user._id;


        // delete all posts of user
        
        for(let i = 0; i < posts.length; i++){
            let post = await Post.findById(posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await post.remove();
        }
        

        // removing user from followers following

        for(let i = 0; i < followers.length; i++){
            let follower = await User.findById(followers[i]);
            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
        }


        // removing user from following's followers

        for(let i = 0; i < followings.length; i++){
            let following = await User.findById(followings[i]);
            const index = following.followers.indexOf(userId);
            following.followers.splice(index, 1);
            await following.save();
        }

        // removing user photos from cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        // removing all comments of the user from all posts
        let allPosts = await Post.find();

        for(let i = 0; i < allPosts.length; i++){
            const post = await Post.findById(allPosts[i]._id);
            for(let j = 0; j < post.comments.length; j++){
                if(post.comments[j].user === userId){
                    post.comments.splice(j, 1);
                    
                }
            }

            await post.save();
        }


        // removing all likes from the user from all posts

        for(let i = 0; i < allPosts.length; i++){
            const post = await Post.findById(allPosts[i]._id);
            for(let j = 0; j < post.likes.length; j++){
                if(post.likes[j] === userId){
                    post.likes.splice(j, 1);
                    
                }
            }

            await post.save();
        }


        
        
        await user.remove();

        // logout user

        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()), 
            httpOnly: true,

        }).json({
            success: true,
            message: "user deleted",
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// view my profile
exports.myProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).populate("posts followers following");
        res.status(200).json({
            success: true,
            user,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).populate("posts followers following");
        if(!user){
            res.status(404).json({
                success: false,
                message: "user not found",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find({name: {$regex: req.query.name, $options: 'i'}});
        // const users = await User.find({}).populate("posts");
        res.status(200).json({
            success: true,
            users,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.forgotPassword = async (req, res) => {
    try{
        const user = await User.findOne({
            email: req.body.email,
        });

        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found...",
            });
        }


        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();
        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;
    
        const message = `reset your password by clicking on the link below: \n\n ${resetUrl}`;
        try{
            await sendEmail({
                email: user.email,
                subject: "reset password",
                message,
            });
            res.status(200).json({
                success: true,
                message: `message sent to ${user.email}...`,
            });
        }catch(error){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.resetPassword = async (req, res) => {
    try{
        if(!req.body.password){
            res.status(404).json({
                success: false,
                message: "new password is required.",
            });
        }

        const resetPasswordToken = crypto.createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if(!user){
            res.status(404).json({
                success: false,
                message: "token is invalid or has expired.",
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        res.status(200).json({
            success: true,
            message: "password updated successfully",
        });

        await user.save();

    }catch(error){
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}


// get user posts

exports.getUserPosts = async (req, res) => {
    try{
        const users = await User.findById(req.params.id);
        const posts = [];
        
        for(let i = 0; i < users.posts.length; i++){
            const post = await Post.findById(users.posts[i]).populate('likes comments.user owner');
            posts.push(post);
        }
        // const users = await User.find({}).populate("posts");
        res.status(200).json({
            success: true,
            posts,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}