const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, profilePhoto } = req.body;
    if (!firstname || !lastname || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400).json({ message: "User already exists" });
        // throw new Error("User already registered")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, lastname, email, password: hashedPassword, });

    res.status(201).json({ message: "User registered", data: user })
});



const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {

            return res.status(400).json({ message: "Incorrect Credentials" });       
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: "Incorrect Credentials" });
        }
        res.status(200).json({message: "Login successful", data: {
                                                            firstname: user.firstname,
                                                            email: user.email,
                                                            token: generateToken(user._id)
                                                        }})

    } catch (error) {
        res.json(error.message);
    }
});


const profile = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id)
        res.status(201).json({ message: "User profile", data: user })

    } catch (error) {
        res.status(400).json(error.message)

    }
};

const getUsers = async (req, res) => {
    try {
        res.status(201).json({ message: "Users", data: "correct" })

    } catch (error) {
        res.status(400).json(error.message)

    }
};

const updateUser = async (req, res) => {
    try {
        res.status(201).json({ message: "Update User", data: "correct" })

    } catch (error) {
        res.status(400).json(error.message)

    }
};

const deleteUser = async (req, res) => {
    try {
        res.status(201).json({ message: "Delete User", data: "correct" })

    } catch (error) {
        res.status(400).json(error.message)

    }
};



module.exports = {
    register,
    login,
    profile,
    getUsers,
    updateUser,
    deleteUser
};