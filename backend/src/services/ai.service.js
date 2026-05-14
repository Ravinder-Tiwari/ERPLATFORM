import { Mistral } from "@mistralai/mistralai";

import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

export const chatWithAI = async (req, res) => {

  try {

    const { message } = req.body;

    const userId = req.id;

    // Get user
    const user = await User.findById(userId);

    // Get applications
    const applications = await Application.find({
      applicant: userId
    }).populate("job");

    // Build jobs array
    const appliedJobs = applications.map(app => ({
      title: app.job?.title,
      company: app.job?.companyName,
      status: app.status
    }));

    // Prompt
    const prompt = `
You are an AI career assistant.

User Name:
${user?.fullname}

Skills:
${user?.profile?.skills?.join(", ") || "No skills"}

Bio:
${user?.profile?.bio || "No bio"}

Applied Jobs:
${JSON.stringify(appliedJobs)}

User Question:
${message}

Answer professionally.
`;

    // Generate AI response
    const response = await client.chat.complete({

      model: "mistral-large-latest",

      messages: [
        {
          role: "system",
          content: "You are a professional AI career assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ]

    });

    return res.status(200).json({
      success: true,
      reply: response.choices[0].message.content
    });

  } catch (error) {

    console.log("AI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "AI Error"
    });

  }
};