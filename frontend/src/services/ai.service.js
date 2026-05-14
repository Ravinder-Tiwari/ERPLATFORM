import axios from "axios";

const AI_API_URL = "http://localhost:3000/api/ai";

class AIService {

  // Send message to backend AI controller
  async generateResponse(message) {
    try {

      const response = await axios.post(
        `${AI_API_URL}/chat`,
        {
          message
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      return response.data.reply;

    } catch (error) {

      console.error(
        "AI Service Error:",
        error.response?.data || error.message
      );

      return "Sorry, AI is currently unavailable.";
    }
  }
}

export const aiService = new AIService();