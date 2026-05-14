import { useState } from "react";
import { aiService } from "../services/ai.service";

const useGeminiAI = () => {

  const [loading, setLoading] = useState(false);

  const generateContent = async (prompt) => {

    try {

      setLoading(true);

      // Call AI service
      const response =
        await aiService.generateResponse(prompt);

      return response;

    } catch (error) {

      console.error(
        "AI Hook Error:",
        error
      );

      return "Sorry, something went wrong.";

    } finally {

      setLoading(false);

    }
  };

  return {
    generateContent,
    loading
  };
};

export default useGeminiAI;