import { Job } from "../models/job.model.js";

//for admin lay job post garxa
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experienceLevel ||
      !position ||
      !companyId
    ) {
      return res.status(400).send({
        success: true,
        message: "all fields are required",
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel,
      position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).send({
      success: true,
      message: "New Job created successfully",
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

//for students
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).send({
        success: false,
        message: "job not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "job found successfully",
      jobs,
    });
  } catch (error) {
    console.log(error);
  }
};

//for students
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({
        success: false,
        message: "job not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "job found",
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

//for admin lay kati ota job post garay ko xa aahelay samma
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({
      created_by: adminId, // yo admin lay kati ota job banay ko xa tyo particular admin ko id bata find garay ko
    });
    if (!jobs) {
      return res.status(404).send({
        success: false,
        message: "jobs not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "jobs found",
      jobs,
    });
  } catch (error) {
    console.log(error);
  }
};
