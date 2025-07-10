# 🌆 CityPulse

**Smart Real-time City Dashboard**  
Built for the **Google Agentic Hackathon 2025**, CityPulse provides **real-time, AI-powered insights** into urban metrics such as Air Quality, Weather, Population, and Live City Alerts. Stay informed and connected—wherever you are.

---

## 🚀 Live Demo

🔗 

---

## 🧠 Features

- 📍 Auto-detects your current city using geolocation
- 🌫️ Real-time **Air Quality Index (AQI)** via WAQI
- 🌡️ Live **temperature & weather** via OpenWeatherMap
- 🧑‍🤝‍🧑 City **population insights** via GeoDB Cities
- 📢 Real-time **incident alerts & summaries**
- 📊 AI-generated **historical reports** and **predictive insights**
- 📥 Export metrics as **CSV or PDF**
- 🌙 Toggle between **Dark & Light** mode
- 📈 Beautiful, responsive **UI dashboard** with charts & maps

---

## 🛠️ Tech Stack

| Layer       | Technologies                                 |
|-------------|----------------------------------------------|
| Frontend    | React.js, Tailwind CSS, Chart.js             |
| State Mgmt  | React Hooks                                   |
| Routing     | React Router                                  |
| APIs Used   | WAQI, OpenWeatherMap, GeoDB Cities, Gemini AI |
| Dev Tools   | Vite, jsPDF                                   |

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/citypulse-ai.git
   cd CityPulse
2. **Install dependencies**
   ```bash
   npm install
3. Create a .env file in root
   ```bash
   REACT_APP_OPENWEATHER_API_KEY=your_openweather_key
   REACT_APP_WAQI_API_KEY=your_waqi_key
   REACT_APP_RAPIDAPI_KEY=your_rapidapi_key
4. Start the development server
   ```bash
   npm start

📁 Project Structure

citypulse-ai/
├── public/
├── src/
│   ├── assets/          # Icons, images, logos
│   ├── components/      # UI components
│   ├── pages/           # Dashboard, Compare, Alerts, etc.
│   ├── sentiment/       # Sentiment & mood analysis logic
│   ├── services/        # External API integrations
│   ├── data/            # Local or fallback data
│   └── App.js           # Main app router
├── .env.example         # Example env config
├── README.md
├── LICENSE

## 👩‍💻 Team Credits

**CityPulse** was built by **Team Debug Divas** as part of the **Google Agentic Hackathon 2025**.

### Team Members:
💡 Ashmita Goyal
🛠️ Gargi Bajpai
📊 Lipika Tomar

Together, we built an AI-powered real-time smart city monitoring dashboard.

🤝 Contributing
We welcome improvements and ideas even post-hackathon!
-Fork this repo
-Create a feature branch (git checkout -b feature-name)
-Commit and push (git commit -m "Add feature")
-Open a pull request 🚀

📬 Contact
Team CityPulse

Built with ❤️ for the Google Agentic Hackathon 2025

💼 License
This project is licensed under the MIT License.
See LICENSE for more details.

---
