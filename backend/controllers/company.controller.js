import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).send({
        success: false,
        message: "company name is required",
      });
    }
    let company = await Company.findOne({ name: companyName });
    //if the company name is in the db that means the company with that name is already registered
    if (company) {
      return res.status(200).send({
        success: false,
        message: "You can't add register same company name ",
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(201).send({
      success: true,
      message: "company registerd successfully",
      company,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //logged in user id
    const companies = await Company.find({ userId }); //getting all the compnay that is registered by the particular userId
    if (!companies) {
      return res.status(404).send({
        success: false,
        message: "companies not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "list of company",
      companies,
    });
  } catch (error) {
    console.log(error);
  }
};

//get company by the company id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).send({
        success: false,
        message: "Companie not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "company found",
      company,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    //idher cloudinary ayega

    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!company) {
      return res.status(404).send({
        success: false,
        message: "Compnay not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Company information updated",
      company,
    });
  } catch (error) {
    console.log(error);
  }
};
