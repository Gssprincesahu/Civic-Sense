import bcryptjs from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const Signup = async(req,res) => {
  try{
    const {username,email, password} = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({message: "User already exists"});
    }
    const hashPssword = await bcryptjs.hash(password,10);

    const createdUser = new User({
        username: username,
        email: email,
        password: hashPssword,
    });
    await createdUser.save();
    res.status(201).json({message: "User created successfully",
    user: {
        id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
    },
});
    }
    catch(error){
        console.error('Signup error details:', error);
        res.status(500).json({message: "Something went wrong", error: error.message});
  }
};

export const googleSignup = async (req, res) => {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error('GOOGLE_CLIENT_ID not configured in environment variables');
      return res.status(500).json({ message: "Google authentication not configured" });
    }
    
    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ username, email, password: '' });
      await user.save();
    }
    
    // Generate JWT token for Google signup
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      }, process.env.JWT_SECRET, { expiresIn: '14d' }
    );
    
    // Set HTTP only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
    
    res.status(200).json({ message: "Google signup successful", user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Google signup error:', error);
    res.status(500).json({ message: "Google signup failed", error: error.message });
  }
};


export const Login = async(req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    const isMatch = await bcryptjs.compare(password, user.password );
    if(!user || !isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }
    else {
      // generate jwt token
      const token = jwt.sign(
        {
          userId : user._id,
          email: user.email
        },process.env.JWT_SECRET,{expiresIn: '14d'}
      );
      
      //set https only cookie

      res.cookie('token', token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 14 * 24 * 60 * 60 * 1000, 
      });

      res.status(200).json({
        message: "Login successful",
        user:{
          _id: user._id,
          username : user.username,
          email: user.email,
        },
      });
  }
}
catch(error){
  res.status(500).json({message: "Internal server error"})
}
};

export const Logout = async (req,res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if(!token){
      return res.status(401).json({isAuthenticated: false});
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.userId).select('-password');

    res.status(200).json({
      isAuthenticated: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  }
  catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};