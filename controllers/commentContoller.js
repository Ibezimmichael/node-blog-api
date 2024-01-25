
const createComment = async(req, res) => {
    try {
        res.status(201).json({message: "Comment created", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
}


const getAllComments = async(req, res) => {
    try {
        res.status(201).json({message: "All comments", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
}

const updateComment = async(req, res) => {
    try {
        res.status(201).json({message: "Update comments", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
}

const deleteComment = async(req, res) => {
    try {
        res.status(201).json({message: "Delete comments", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
}



module.exports = {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
}