const express = require('express');
const User = require('./model/user');
const jwt = require("jsonwebtoken");
const router = express.Router();
// router.get('/users', (req, res) => {
//   res.json(req.body);
// });

// Create a new user
router.post('/users', async (req, res) => {
  const { name, email, age } = req.body;

  try {
    const user = new User({ name, email, age });
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get a user
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
 
    try {
      const user = await User.findById(id);
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  
// Update a user
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post('/register',async(req,res)=> {
  const {name,email,password}=req.body;
  if(!(email && name && password))
  {
    res.send("All field not filled");
  }
  const oldUser= await User.findOne({email});
  if(oldUser)
  {
    res.send("user exist");
  }
  const user = new User({ name, email, password });
    
//  const user = new User({
//   name:name,
//   email:email,
//   password:password
//  });
 const token = jwt.sign(
  {password,email},
  process.env.TOKEN_KEY,
  {
    expiresIn:"2h",
  }
 )
  user.token =token;
  await user.save();
  res.send("Registered");
});

router.post('/login',async(req,res)=>{
  const {  email, password } = req.body;
  if(!(email && password))
  {
    res.send("all fields not filled");
  }
  const user = await User.findOne({
    email
  });
  if(user)
  {
    const token = jwt.sign(
      {password,email},
      process.env.TOKEN_KEY,
      {
        expiresIn:"2h",
      }
     )
      user.token =token;
      res.send(user.token);
  }
}
);
router.post("/register1", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name )) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }


    // Create user in our database

    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});


router.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.send("login successfully")
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
let AuthenticateUser = async(req , res , next) =>{

  let token = req.headers.authorization.split(' ')[1];

  try{
  let DecodedData = await jwt.verify(token , process.env.TOKEN_KEY)
  if(DecodedData)
  {
      req.User = DecodedData;
      next()
  }else
  {
      res.status(404).json({"Message":"Your Are Not Authenticated"})
  }
}catch(err)
{
  res.status(404).json({"Message":"Your Are Not Authenticated" , err})

}}
router.post("/welcome", AuthenticateUser, (req, res) => {
  res.status(200).send("Welcome ");
});

module.exports = router ;
