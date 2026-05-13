import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        
        // Check if recruiter has already created a company
        const existingCompany = await Company.findOne({ userId: req.id });
        if (existingCompany) {
            return res.status(400).json({
                message: "You can only create one company. You have already created a company.",
                success: false
            })
        }
        
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error registering company.",
            success: false
        });
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId }).sort({ createdAt: -1 });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching companies.",
            success: false
        });
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching company.",
            success: false
        });
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        
        console.log("Update company request:", {
            companyId: req.params.id,
            name, description, website, location,
            hasFile: !!req.file
        });

        const existingCompany = await Company.findById(req.params.id);
        if (!existingCompany) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }

        const updateData = { name, description, website, location };

        if (req.file) {
            console.log("Uploading file to Cloudinary:", req.file.filename);
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
            console.log("Logo URL:", cloudResponse.secure_url);
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        
        console.log("Company updated successfully:", company);
        
        return res.status(200).json({
            message:"Company information updated.",
            company,
            success:true
        })

    } catch (error) {
        console.log("Error updating company:", error);
        return res.status(500).json({
            message: "Error updating company.",
            success: false
        });
    }
}