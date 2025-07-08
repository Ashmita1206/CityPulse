import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { categories } from '../data/mockData';
import toast from 'react-hot-toast';
import indianCities from '../data/indianCities';
import { fetchCityMetrics } from '../services/cityMetricsService';

const Subscribe = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    city: indianCities[0].name
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cityMetrics, setCityMetrics] = useState(null);
  const selectedCity = indianCities.find(c => c.name === formData.city) || indianCities[0];

  useEffect(() => {
    setCityMetrics(null);
    fetchCityMetrics(selectedCity.name).then(metrics => {
      console.log('[CityPulse] Subscribe cityMetrics:', metrics);
      setCityMetrics(metrics);
    });
  }, [selectedCity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleNotification = (type) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please provide an email address');
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Subscription created successfully!');
      setFormData({ email: '', name: '', phone: '', city: indianCities[0].name });
      setSelectedCategories([]);
      setNotificationPreferences({ email: true, push: false, sms: false });
    } catch (error) {
      toast.error('Failed to create subscription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Subscribe to Smart Alerts
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get personalized notifications about events in your city of interest
            </p>
          </div>

          {/* City Metrics & Tips */}
          <div className="card mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">City:</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input-field text-sm max-w-xs"
              >
                {indianCities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-wrap gap-4 items-center">
              {cityMetrics && (
                <>
                  <div className="card text-center p-4 min-w-[120px]">
                    <div className="text-xs text-gray-500">AQI</div>
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {typeof cityMetrics.aqi === 'number' ? (
                        <span>{cityMetrics.aqi}</span>
                      ) : (
                        <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">
                          {cityMetrics.aqi}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="card text-center p-4 min-w-[120px]">
                    <div className="text-xs text-gray-500">Temp (°C)</div>
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      {typeof cityMetrics.temp === 'number' ? (
                        <span>{cityMetrics.temp}</span>
                      ) : (
                        <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">
                          {cityMetrics.temp}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="card text-center p-4 min-w-[120px]">
                    <div className="text-xs text-gray-500">Humidity (%)</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {typeof cityMetrics.humidity === 'number' ? (
                        <span>{cityMetrics.humidity}</span>
                      ) : (
                        <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">
                          {cityMetrics.humidity}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex-1">
              {cityMetrics && cityMetrics.tips[formData.city] && (
                <div className="card bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-900 dark:text-blue-100">
                  <span className="font-semibold">Smart Tip:</span> {cityMetrics.tips[formData.city]}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <DevicePhoneMobileIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Categories of Interest *
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Select the types of events you want to be notified about
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                      selectedCategories.includes(category.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {category.id === 'traffic' && 'Traffic jams, accidents, road closures'}
                        {category.id === 'civic' && 'Waterlogging, garbage, infrastructure'}
                        {category.id === 'power' && 'Power outages, electrical issues'}
                        {category.id === 'weather' && 'Heavy rain, storms, weather alerts'}
                      </div>
                    </div>
                    {selectedCategories.includes(category.id) && (
                      <CheckIcon className="h-5 w-5 text-blue-600 ml-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Email Notifications
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Receive alerts via email
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('email')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      notificationPreferences.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        notificationPreferences.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <SparklesIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Push Notifications
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Browser push notifications
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('push')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      notificationPreferences.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        notificationPreferences.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        SMS Notifications
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Text message alerts (requires phone number)
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('sms')}
                    disabled={!formData.phone}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      notificationPreferences.sms ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    } ${!formData.phone ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        notificationPreferences.sms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Creating Subscription...
                  </div>
                ) : (
                  'Create Subscription'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscribe; 