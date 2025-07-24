const bcrypt = require('bcrypt');
const COLLECTION_NAME = 'Users';

const userModal = {
    
    registerUser: async (db, user) => {
        const collection = db.collection(COLLECTION_NAME);
        const existingUser = await collection.findOne({ email: user.email });
        if (existingUser) {
            return { sucess: false,message: 'User Already exists' };
        }
        if(user.password!="GoogleLogin"&&(user.password==undefined||user.name==undefined||user.email==undefined||user.confirmPassword==undefined)){ 
            return { sucess: false,message: 'Please fill all the fields'};
        }
        if(user.password!="GoogleLogin"&&user.password!=user.confirmPassword){
            return { sucess: false,message: 'Passwords do not match'};
        }
        if(user.password!="GoogleLogin") {
            user.password = await bcrypt.hash(user.password, 10);
        }
        delete user.confirmPassword;
        const result = await collection.insertOne(user);
        return { sucess: true,message: 'User registered successfully', user: { id: result.insertedId, ...user } };
    },
    updateUser: async (db, userId, user) => {
        const collection = db.collection(COLLECTION_NAME);
        if(userid==undefined||user==undefined){
            return { sucess: false,message: 'Login Id is missing to update details'};
        }
        const result = await collection.updateOne({ _id: userId }, { $set: user });
        return { sucess: true,message: 'User updated successfully' };
    },
    loginUser: async (db, email, password) => {
        const collection = db.collection(COLLECTION_NAME);

        try {
            const user = await collection.findOne({ email });
            if (!user) {
                return { success: false, message: 'Invalid email or password' };
            }

            if (password === "GoogleLogin") {
                if (!user.password) {
                    return { success: false, message: 'User is not logged in with google account' };
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
            } else {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return { success: false, message: 'Invalid email or password' };
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
        } catch (error) {
            console.error('Error during login:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    },
};

module.exports = userModal;
