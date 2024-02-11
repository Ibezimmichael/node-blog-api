const Category = require("../models/Category");
const { appErr, AppErr } = require("../utils/appErr");


const createCategory = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const category = await Category.create({ name, description, user: req.userAuth });
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    res.json(error.message);
  }
};


const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    res.json(error.message);
  }
};


//update
const updateCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const cat= await Category.findById(req.params.id);
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );
        res.json({
            status: "success",
            data: category,
        });
      } catch (error) {
        res.json(error.message);
    }
};



const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "Deleted successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
}
