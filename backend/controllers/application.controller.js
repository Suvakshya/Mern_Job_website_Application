import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(404).send({
        success: false,
        message: "job id is required",
      });
    }
    //check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).send({
        success: false,
        message: "You have already applied for this job",
      });
    }
    //check if the job exgists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({
        success: false,
        message: "job not found",
      });
    }
    //create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).send({
      success: true,
      message: "job applied successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).send({
        success: false,
        message: "No application found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "application found",
      application,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).send({
        success: false,
        message: "Job not found",
      });
    }
    return res.status(200).send({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(404).send({
        success: false,
        message: "STATUS is required",
      });
    }
    //find the applicant by applicatoion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).send({
        success: false,
        message: "application not found",
      });
    }

    //update the status
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).send({
      success: true,
      message: "status updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
