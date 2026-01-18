import Data from '../models/data.model.js';
import cloudinary from '../config/cloudinary.js';


export const createIssue = async (req, res) => {
    try{
        const { title, category, location, priority, image, description, address, city, state, zipCode, country, coordinates } = req.body;

        // Validate required fields

        if (!title || !category || !location || !priority || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: title, category, location, priority, and description'
            });
        }

        // image URL

        let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
        let imagePublicId = null;

        if(req.file){
            imageUrl = req.file.path;
            imagePublicId = req.file.filename;
        }
        // Create new issue document using Mongoose model

        const newIssue = new Data({
            title,
            category,
            location,
            priority,
            image: imageUrl,
            imagePublicId: imagePublicId,
            description,
            address,
            city,
            state,
            zipCode,
            country,
            coordinates
        });

        // Save to MongoDB - This is where data gets stored in the database
        await newIssue.save();

        // Send success response with created data
        res.status(201).json({
            success: true,
            message: 'Issue created successfully',
            data: newIssue
        });

    } catch (error) {
        console.error('Create issue error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create issue',
            error: error.message
        });
    }
};


export const getAllIssues = async (req, res) => {
    try {
        // Fetch all issues from database, sorted by creation date (newest first)
        const issues = await Data.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: issues.length,
            data: issues
        });

    } catch (error) {
        console.error('Get issues error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch issues',
            error: error.message
        });
    }
};


export const getIssueById = async (req, res) => {
    try {
        // Find issue by MongoDB _id from URL parameter
        const issue = await Data.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        res.status(200).json({
            success: true,
            data: issue
        });

    } catch (error) {
        console.error('Get issue error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch issue',
            error: error.message
        });
    }
};

/**
 * UPDATE ISSUE
 * Route: PUT /api/issues/:id
 * Purpose: Update an existing issue report
 * Note: Useful for updating status, adding comments, etc. (future features)
 */
export const updateIssue = async (req, res) => {
    try {
        // Find and update issue, return the updated document
        const issue = await Data.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // new: true returns updated doc, runValidators validates the update
        );

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Issue updated successfully',
            data: issue
        });

    } catch (error) {
        console.error('Update issue error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update issue',
            error: error.message
        });
    }
};

/**
 * DELETE ISSUE
 * Route: DELETE /api/issues/:id
 * Purpose: Remove an issue report from the database
 */
export const deleteIssue = async (req, res) => {
    try {
        const issue = await Data.findByIdAndDelete(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        if(issue.imagePublicId){
            await cloudinary.uploader.destroy(issue.imagePublicId);
        }

        res.status(200).json({
            success: true,
            message: 'Issue deleted successfully'
        });

    } catch (error) {
        console.error('Delete issue error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete issue',
            error: error.message
        });
    }
};
