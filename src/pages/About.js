import React from 'react';
import { motion } from 'framer-motion';
import { 
  CodeBracketIcon,
  ServerIcon,
  CpuChipIcon,
  GlobeAltIcon,
  SparklesIcon,
  ShieldCheckIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const techStack = [
    {
      category: 'Frontend',
      icon: CodeBracketIcon,
      technologies: [
        { name: 'React.js', description: 'Modern UI framework' },
        { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
        { name: 'Framer Motion', description: 'Animation library' },
        { name: 'React Router', description: 'Client-side routing' }
      ]
    },
    {
      category: 'Backend & Database',
      icon: ServerIcon,
      technologies: [
        { name: 'Firebase', description: 'Backend-as-a-Service' },
        { name: 'Firestore', description: 'NoSQL cloud database' },
        { name: 'Firebase Auth', description: 'User authentication' },
        { name: 'Firebase Storage', description: 'File storage' }
      ]
    },
    {
      category: 'AI & Machine Learning',
      icon: CpuChipIcon,
      technologies: [
        { name: 'Google Gemini', description: 'Multimodal AI model' },
        { name: 'Vertex AI', description: 'ML platform' },
        { name: 'BigQuery', description: 'Data warehouse' },
        { name: 'Custom APIs', description: 'AI service integration' }
      ]
    },
    {
      category: 'Maps & Location',
      icon: GlobeAltIcon,
      technologies: [
        { name: 'Google Maps API', description: 'Interactive mapping' },
        { name: 'Geolocation', description: 'Location services' },
        { name: 'Geocoding', description: 'Address conversion' },
        { name: 'Real-time Updates', description: 'Live data streaming' }
      ]
    }
  ];

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Analysis',
      description: 'Google Gemini processes text, images, and videos to generate intelligent summaries and predictions.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Real-time Mapping',
      description: 'Interactive Google Maps integration with live markers and real-time updates.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Infrastructure',
      description: 'Enterprise-grade security with Firebase authentication and encrypted data storage.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Predictive Analytics',
      description: 'Advanced forecasting algorithms to predict urban events and potential disruptions.'
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About CityPulse
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              An AI-powered urban intelligence platform that transforms scattered city data 
              into actionable insights for citizens and city planners.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="card mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Cities generate massive amounts of real-time data from traffic cameras, social media, 
                citizen reports, and IoT sensors. This information is often scattered, noisy, and 
                difficult to interpret in real-time. CityPulse uses cutting-edge AI technology to 
                synthesize this data into clear, actionable insights that help citizens navigate their 
                city more intelligently and help city planners make data-driven decisions.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Technology Stack
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {techStack.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {category.technologies.map((tech) => (
                      <div key={tech.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {tech.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {tech.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="card mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Data Collection
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Citizens submit reports with text, photos, and videos. System also ingests data from 
                  traffic cameras, social media, and IoT sensors.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  AI Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Google Gemini AI analyzes the data, generates summaries, detects patterns, and 
                  creates predictive models for future events.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Intelligence Delivery
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Processed insights are displayed on interactive maps with real-time updates and 
                  personalized alerts for users.
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/your-username/citypulse-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                <CodeBracketIcon className="h-5 w-5 mr-2" />
                View on GitHub
              </a>
              <a
                href="https://citypulse-ai.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center"
              >
                <RocketLaunchIcon className="h-5 w-5 mr-2" />
                Live Demo
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 