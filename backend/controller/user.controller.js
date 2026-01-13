import bcryptjs from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model.js';

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
        console.error('Signup error:', error);
        res.status(500).json({message: "Something went wrong"});
  }
};

export const googleSignup = async (req, res) => {
  try {
    const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: 'YOUR_GOOGLE_CLIENT_ID',
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ username, email, password: '' });
      await user.save();
    }
    res.status(200).json({ message: "Google signup successful", user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Google signup failed" });
  }
};
