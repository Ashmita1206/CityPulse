import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  ChartBarIcon, 
  CameraIcon, 
  BellIcon,
  SparklesIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const featuresRef = useRef(null);

  const features = [
    {
      icon: MapPinIcon,
      title: 'Real-time Mapping',
      description: 'Interactive maps showing live urban events and incidents'
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Analysis',
      description: 'Google Gemini AI processes and summarizes complex data streams'
    },
    {
      icon: CameraIcon,
      title: 'Multimodal Reports',
      description: 'Submit photos and videos for AI-enhanced analysis'
    },
    {
      icon: ChartBarIcon,
      title: 'Predictive Analytics',
      description: 'Forecast urban events and potential disruptions'
    },
    {
      icon: BellIcon,
      title: 'Smart Alerts',
      description: 'Personalized notifications based on your interests'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    }
  ];

  // Smooth scroll to features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                See Your City in{' '}
                <span className="text-gradient">Real Time</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                AI-powered urban insights, synthesized from the noise. 
                Transform scattered data into actionable intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
                >
                  <GlobeAltIcon className="h-5 w-5 mr-2" />
                  Explore Dashboard
                </Link>
                <button
                  onClick={scrollToFeatures}
                  className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  See Features
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Animated illustration */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-64 h-32 bg-gradient-to-t from-blue-600/20 to-transparent rounded-t-full animate-float"></div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                The Problem We Solve
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Cities generate massive amounts of real-time data from traffic cameras, 
                social media, citizen reports, and IoT sensors. This information is often 
                scattered, noisy, and difficult to interpret in real-time.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                CityPulse uses Google Gemini AI to synthesize this data into clear, 
                actionable insights. Our platform combines Firebase backend, Google Maps, 
                and advanced AI to create a comprehensive urban intelligence dashboard.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Real-time data processing
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">AI Processing</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Gemini analyzes data streams</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <GlobeAltIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Mapping</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Google Maps integration</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <ShieldCheckIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Secure Backend</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Firebase-powered infrastructure</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to understand and navigate your city in real-time
            </p>
          </motion.div>
          {/* Animated Feature Cards Carousel */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-8 min-w-[600px] md:min-w-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-lg transition-shadow duration-300 min-w-[280px] md:min-w-0"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience Smart City Intelligence?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of citizens already using CityPulse to navigate their city smarter.
            </p>
            <Link
              to="/dashboard"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg inline-flex items-center transition-colors duration-200"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 