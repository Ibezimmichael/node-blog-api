

const register = async(req, res) => {
    try {
        res.status(201).json({message: "User registered", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};


const login = async (req, res) => {
    try {
        res.status(201).json({message: "User logged in", data:"correct"});
    } catch (error) {
        res.status(400).json(error.message);
    }
};

const profile = async(req, res) => {
    try {
        res.status(201).json({message: "User profile", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};

const getUsers = async(req, res) => {
    try {
        res.status(201).json({message: "Users", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};

const updateUser = async(req, res) => {
    try {
        res.status(201).json({message: "Update User", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};

const deleteUser = async(req, res) => {
    try {
        res.status(201).json({message: "Delete User", data: "correct"})
        
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