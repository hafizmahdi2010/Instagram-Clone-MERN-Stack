var express = require('express');
var router = express.Router();
var userModel = require("../models/userModel");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var postModel = require("../models/postModel");
const multer = require('multer')
var path = require("path");

const secret = "secret";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", async (req, res) => {
  try {

    let { username, name, email, pwd } = req.body;
    let emailCon = await userModel.findOne({ email: email });
    if (emailCon) {
      return res.json({
        success: false,
        msg: "Email already exists",
      });
    }
    else {
      bcrypt.genSalt(12, function (err, salt) {
        bcrypt.hash(pwd, salt, async function (err, hash) {

          let user = await userModel.create({
            username: username,
            name: name,
            email: email,
            password: hash,
          });

          return res.json({
            success: true,
            msg: "User created successfully",
          });

        });
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {

    let { email, pwd } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    else {
      bcrypt.compare(pwd, user.password, function (err, result) {
        if (result) {

          let token = jwt.sign({ email: user.email, userId: user._id }, secret);

          return res.json({
            success: true,
            msg: "User logged in successfully",
            token,
            userId: user._id
          });
        }
        else {
          return res.json({
            success: false,
            msg: "Invalid password",
          })
        }
      })

    }

  }
  catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    })
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let extName = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extName);
  }
})

const upload = multer({ storage: storage })

router.post('/createPost', upload.single('image'), async function (req, res) {
  try {

    let { token, caption } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    let post = await postModel.create({
      caption: caption,
      image: req.file.filename,
      uploadedBy: decoded.userId,
      likes: [],
    });

    return res.json({
      success: true,
      msg: "Post created successfully",
      postId: post._id
    });

  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    })
  }
});

router.post("/toggleLike", async (req, res) => {
  try {

    let { token, postId } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    let post = await postModel.findById(postId);
    if (!post) {
      return res.json({
        success: false,
        msg: "Post not found",
      });
    }

    if (post.likes.some(like => like.userId === decoded.userId)) {
      post.likes.pull({ userId: decoded.userId });
      await post.save();
      return res.json({
        success: true,
        msg: "Post unliked successfully",
        action: "dislike"
      });
    }
    else {
      post.likes.push({ userId: decoded.userId });
      await post.save();
      return res.json({
        success: true,
        msg: "Post liked successfully",
        action: "like"
      });
    }

  } catch (error) {
    console.log(error)
    return res.json({
      success: false,
      msg: error.message,
    })
  }
});

router.post("/toggleFollow", async (req, res) => {
  try {

    let { token, userId } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    if (userId === decoded.userId) {
      return res.json({
        success: false,
        msg: "You can't follow yourself",
      })
    };

    let otherUser = await userModel.findById(userId);
    if (!otherUser) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    if (otherUser.followers.some(follower => follower.userId === decoded.userId)) {
      otherUser.followers.pull({ userId: decoded.userId });
      await otherUser.save();
      return res.json({
        success: true,
        msg: "User unfollowed successfully",
        action: "Unfollow"
      })
    }
    else {
      otherUser.followers.push({ userId: decoded.userId });
      await otherUser.save();
      return res.json({
        success: true,
        msg: "User followed successfully",
        action: "Follow"
      })
    }

  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    })
  }
});

router.post("/getPosts", async (req, res) => {
  try {

    let { token } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    let posts = await postModel.find({});
    let fullData = await Promise.all(
      posts.map(async (post) => {
        let user = await userModel.findById(post.uploadedBy);
        return {
          post: {
            _id: post._id,
            caption: post.caption,
            likes: post.likes.length,
            image: post.image,
            date: post.date,
            isYouLiked: post.likes.some(like => like.userId === decoded.userId),
          },
          user: {
            _id: user._id,
            username: user.username,
            followers: user.followers.length,
            date: user.date,
            isYouFollowed: user.followers.some(follower => follower.userId === decoded.userId),
          },
        };
      })
    );

    return res.json({
      success: true,
      msg: "Posts fetched successfully",
      data: fullData,
    })

  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    })
  }
});

router.post("/getUserDetails", async (req, res) => {
  try {

    let { token, userId } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    let otherUser = await userModel.findById(userId);
    if (!otherUser) {
      return res.json({
        success: false,
        msg: "Other user not found !"
      });
    }

    let posts = await postModel.find({ uploadedBy: userId });

    return res.json({
      success: true,
      msg: "User details fetched successfully",
      data: {
        _id: otherUser._id,
        username: otherUser.username,
        followers: otherUser.followers.length,
        date: otherUser.date,
        isYouFollowed: otherUser.followers.some(follower => follower.userId === decoded.userId),
        posts: posts.length,
        isThisYou: userId === decoded.userId,
      }
    });

  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    })
  }
});

router.post("/getMyPosts", async (req, res) => {
  try {

    let { token, userId } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    };

    let otherUser = await userModel.findById(userId);
    if (!otherUser) {
      return res.json({
        success: false,
        msg: "Other user not found !"
      });
    };

    let posts = await postModel.find({ uploadedBy: otherUser._id });

    return res.json({
      success: true,
      msg: "Posts fetched successfully",
      data: posts,
    });

  } catch (error) {
    return res.json({
      success: false,
      msg: error.message,
    })
  }
})

module.exports = router;
