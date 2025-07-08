# 🌆 CityPulse

**Smart Real-time City Dashboard**  
Built for the **Google Agentic Hackathon**, CityPulse offers live insights into key city health metrics—**Air Quality Index (AQI)**, **Temperature**, and **Population**—using intelligent geolocation and multiple open APIs.

![CityPulse Banner](./public/preview.png) <!-- Replace with your actual screenshot -->

---

## 🚀 Live Demo

🔗 [citypulse.vercel.app](https://citypulse.vercel.app) *(Update this once deployed)*

---

## 🧠 Features

- 📍 Auto-detects your current city
- 🌫️ Real-time AQI data (via WAQI)
- 🌡️ Live temperature (via OpenWeather)
- 🧑‍🤝‍🧑 City population insights (via GeoDB)
- 📊 Historical reports and predictions
- 📥 CSV export for metrics
- 💡 Smart, reactive, and responsive UI

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **State**: React Hooks
- **Routing**: React Router
- **APIs**: WAQI, OpenWeatherMap, GeoDB Cities
- **Tools**: Vite, jsPDF, Chart.js

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/citypulse-ai.git
   cd citypulse-ai
2. **Install dependencies**
   npm install
3. Create a .env file in root
   REACT_APP_OPENWEATHER_API_KEY=your_openweather_key
   REACT_APP_WAQI_API_KEY=your_waqi_key
   REACT_APP_RAPIDAPI_KEY=your_rapidapi_key
4. Start the development server
   npm start

📁 Project Structure

citypulse-ai/
├── public/
├── src/
│   ├── assets/        # Icons, images, logos
│   ├── components/    # UI components
│   ├── pages/         # Dashboard, Report, Predict
│   ├── services/      # API handling
│   └── App.js         # Main app routes
├── .env.example       # Sample env vars
├── README.md
├── LICENSE

💼 License
This project is licensed under the MIT License.
See LICENSE for more details.

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
---