

const createPost = async(req, res) => {
    try {
        res.status(201).json({message: "Post created", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};


const getAllPost = async(req, res) => {
    try {
        res.status(201).json({message: "All posts", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};

const getSinglePost = async(req, res) => {
    try {
        res.status(201).json({message: "get post", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
}


const updatePost = async(req, res) => {
    try {
        res.status(201).json({message: "Update post", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};


const deletePost = async(req, res) => {
    try {
        res.status(201).json({message: "Delete post", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};



module.exports = {
    getAllPost,
    getSinglePost,
    createPost,
    updatePost,
    deletePost
};


