const bcrypt = require('bcrypt');
const COLLECTION_NAME = 'Users';

const userModal = {
    registerUser: async (db, user) => {
        const collection = db.collection(COLLECTION_NAME);

        const existingUser = await collection.findOne({ email: user.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }
        if(user.password!="GoogleLogin") {
            user.password = await bcrypt.hash(user.password, 10);
        }
        const result = await collection.insertOne(user);
        return result;
    },

    loginUser: async (db, email, password) => {
        const collection = db.collection(COLLECTION_NAME);

        const user = await collection.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        if (password === "GoogleLogin") {
          // If password is "GoogleLogin", check if the user exists
          const existingUser = await db.collection('Users').findOne({ email });
          
          if (!existingUser) {
              // If the user does not exist, automatically register them
              
              return res.status(401).json({ message: 'User needs to login first', userId: result.insertedId });
          } else {
              // If user exists, log them in
              return res.status(200).json({
                  success: true,
                  message: 'Login successful',
                  user: {
                      id: existingUser._id,
                      name: existingUser.name,
                      email: existingUser.email,
                      image: existingUser.image,
                  },
              });
          }
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
            },
        };
    }
    },
};

module.exports = userModal;
