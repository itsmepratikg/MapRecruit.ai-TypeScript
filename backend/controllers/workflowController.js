const Workflow = require('../models/Workflow');
const mongoose = require('mongoose');

// @desc    Get workflow for a campaign
// @route   GET /api/workflows/:campaignId
// @access  Private
const getWorkflow = async (req, res) => {
    try {
        const { campaignId } = req.params;

        // Handle invalid MongoDB ObjectId (e.g. legacy "1" or improper links)
        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
            // console.warn(`[getWorkflow] Invalid Campaign ID: ${campaignId}. Returning default empty workflow.`);
            return res.status(200).json({ nodes: [], edges: [] });
        }

        const workflow = await Workflow.findOne({
            campaignID: campaignId,
            companyID: req.user.companyID
        });

        if (!workflow) {
            // Return empty structure instead of 404 to allow initialization
            return res.status(200).json({ nodes: [], edges: [] });
        }

        res.status(200).json(workflow);
    } catch (error) {
        console.error('getWorkflow Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Save or update workflow
// @route   POST /api/workflows
// @access  Private
const saveWorkflow = async (req, res) => {
    try {
        const { campaignID, name, nodes, edges, jobFitPreferences, sharedWith } = req.body;
        const companyID = req.user.companyID;

        if (!campaignID || typeof campaignID !== 'string') {
            return res.status(400).json({ message: 'Invalid Campaign ID' });
        }

        let workflow = await Workflow.findOne({ campaignID, companyID });

        if (workflow) {
            workflow.nodes = nodes;
            workflow.edges = edges;
            workflow.name = name || workflow.name;
            if (jobFitPreferences) workflow.jobFitPreferences = jobFitPreferences;
            if (sharedWith) workflow.sharedWith = sharedWith;
            await workflow.save();
        } else {
            workflow = await Workflow.create({
                companyID,
                campaignID,
                name: name || 'Untitled Workflow',
                nodes,
                edges,
                jobFitPreferences,
                sharedWith
            });
        }

        res.status(200).json(workflow);
    } catch (error) {
        console.error('saveWorkflow Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getWorkflow,
    saveWorkflow
};
