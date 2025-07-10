// Mock Gemini AI Service
// In production, replace with actual Google Gemini API calls

export const geminiService = {
  // Analyze text reports and generate summaries
  async analyzeTextReport(text, category) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResponses = {
      traffic: {
        summary: "Heavy traffic congestion detected on main arterial road",
        severity: "High",
        prediction: "Likely delay of 30-45 minutes",
        sentiment: "Frustrated",
        recommendations: ["Consider alternative routes", "Use public transport"]
      },
      civic: {
        summary: "Waterlogging reported in residential area",
        severity: "Medium",
        prediction: "May affect morning commute",
        sentiment: "Concerned",
        recommendations: ["Avoid low-lying areas", "Contact municipal authorities"]
      },
      power: {
        summary: "Power outage affecting commercial district",
        severity: "High",
        prediction: "Restoration expected within 2 hours",
        sentiment: "Inconvenienced",
        recommendations: ["Use backup power", "Contact electricity board"]
      },
      weather: {
        summary: "Heavy rainfall causing visibility issues",
        severity: "Medium",
        prediction: "Weather to improve by evening",
        sentiment: "Cautious",
        recommendations: ["Drive carefully", "Carry rain protection"]
      },
      general: {
        summary: "Urban activity analysis completed with mixed conditions",
        severity: "Medium",
        prediction: "Conditions expected to remain stable",
        sentiment: "Neutral",
        recommendations: ["Monitor local updates", "Stay informed"]
      }
    };

    return mockResponses[category] || mockResponses.traffic;
  },

  // Summarize reports - used by agent modules
  async summarizeReports(descriptions, tag, area) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockSummaries = {
      traffic: {
        summary: `${area ? `Traffic issues in ${area}` : 'Traffic congestion detected'}: ${descriptions.substring(0, 100)}...`,
        severity: "High",
        topIssues: ["Congestion", "Delays", "Accidents"],
        recommendations: ["Use alternative routes", "Consider public transport"]
      },
      power: {
        summary: `${area ? `Power issues in ${area}` : 'Power problems reported'}: ${descriptions.substring(0, 100)}...`,
        severity: "Medium",
        topIssues: ["Outages", "Transformer issues", "Load shedding"],
        recommendations: ["Contact electricity board", "Use backup power"]
      },
      civic: {
        summary: `${area ? `Civic issues in ${area}` : 'Civic problems detected'}: ${descriptions.substring(0, 100)}...`,
        severity: "Medium",
        topIssues: ["Waterlogging", "Garbage", "Road damage"],
        recommendations: ["Contact municipal authorities", "Report issues"]
      },
      weather: {
        summary: `${area ? `Weather issues in ${area}` : 'Weather problems reported'}: ${descriptions.substring(0, 100)}...`,
        severity: "Low",
        topIssues: ["Rain", "Fog", "Visibility"],
        recommendations: ["Drive carefully", "Stay updated"]
      }
    };

    const category = tag?.toLowerCase() || 'general';
    return mockSummaries[category] || {
      summary: `${area ? `Activity in ${area}` : 'Recent activity'}: ${descriptions.substring(0, 100)}...`,
      severity: "Medium",
      topIssues: ["General issues"],
      recommendations: ["Monitor situation", "Stay informed"]
    };
  },

  // Analyze images/videos (multimodal analysis)
  async analyzeMedia(file, description) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      summary: `AI analysis of ${file.name}: ${description}`,
      detectedObjects: ["vehicle", "road", "traffic"],
      severity: "Medium",
      location: "Auto-detected location",
      confidence: 0.85
    };
  },

  // Generate predictive alerts
  async generatePredictions(historicalData) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      alerts: [
        {
          type: "Traffic",
          area: "Downtown",
          probability: 0.75,
          message: "High probability of traffic congestion during rush hour",
          timeframe: "2-3 hours"
        },
        {
          type: "Weather",
          area: "North District",
          probability: 0.60,
          message: "Possible heavy rainfall expected",
          timeframe: "4-6 hours"
        }
      ],
      moodMap: {
        downtown: "Neutral",
        northDistrict: "Concerned",
        southDistrict: "Positive",
        eastDistrict: "Frustrated"
      }
    };
  },

  // Sentiment analysis for mood mapping
  async analyzeSentiment(text) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sentiments = ["Positive", "Neutral", "Negative", "Frustrated", "Concerned"];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  }
};

// Real Gemini API integration (for production)
export const realGeminiService = {
  async callGeminiAPI(prompt, media = null) {
    // This would be replaced with actual Google Gemini API calls
    // using the Google AI SDK or REST API
    console.log('Calling Gemini API with:', { prompt, media });
    
    // Example API call structure:
    // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     contents: [{
    //       parts: [{
    //         text: prompt
    //       }]
    //     }]
    //   })
    // });
    
    // return await response.json();
  }
}; 