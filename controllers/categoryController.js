

const createCategory = async(req, res) => {
    try {
        res.status(201).json({message: "Category created", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};

const getAllCategories = async(req, res) => {
    try {
        res.status(201).json({message: "All categories", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};


const getSingleCategory = async(req, res) => {
    try {
        res.status(201).json({message: "get category", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};


const updateCategory = async(req, res) => {
    try {
        res.status(201).json({message: "Update categoriess", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};

const deleteCategory = async(req, res) => {
    try {
        res.status(201).json({message: "Delete categories", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}
