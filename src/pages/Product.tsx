import React, { useState } from 'react';
import { Eye, Cpu, Battery, Wifi, Camera, Headphones, Shield, Zap, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import DownloadSection from '../components/DownloadSection';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const Product = () => {
  const [activeTab, setActiveTab] = useState('specs');
  const [showDesign, setShowDesign] = useState(false);

  const specifications = [
    {
      category: "Microprocessor",
      items: [
        { label: "Model", value: "Raspberry Pi 4 Model B (8GB)" },
        { label: "CPU", value: "Quad-core Cortex-A72 @ 1.5 GHz" },
        { label: "GPU", value: "VideoCore VI @ 500 MHz" },
        { label: "RAM", value: "8GB LPDDR4-2400 SDRAM" },
        { label: "Power Consumption", value: "3.4–7.6W" }
      ]
    },
    {
      category: "Camera Module",
      items: [
        { label: "Model", value: "Raspberry Pi Camera Module V3" },
        { label: "Sensor", value: "Sony IMX708, 12.3MP" },
        { label: "Resolution", value: "4608 × 2592 (stills), 1920 × 1080 (video)" },
        { label: "Frame Rate", value: "30 fps (1080p)" },
        { label: "Interface", value: "MIPI CSI-2" }
      ]
    },
    {
      category: "Display Module",
      items: [
        { label: "Model", value: "2.8-inch HDMI LCD" },
        { label: "Resolution", value: "480 × 320" },
        { label: "Panel Type", value: "IPS" },
        { label: "Touchscreen", value: "Capacitive" },
        { label: "Power Consumption", value: "0.5–1W" }
      ]
    },
    {
      category: "Audio Components",
      items: [
        { label: "Microphone", value: "BOYA Wireless (2.4 GHz, 48 kHz)" },
        { label: "Speaker", value: "Generic 1W mono (200 Hz–20 kHz)" },
        { label: "Microphone Range", value: "50m" },
        { label: "Microphone Battery", value: "9-hour" }
      ]
    },
    {
      category: "Power & Storage",
      items: [
        { label: "Battery", value: "Anker PowerCore 20000 (20,000 mAh)" },
        { label: "Storage", value: "32GB microSD (100 MB/s)" },
        { label: "Battery Output", value: "30W" },
        { label: "Dimensions", value: "150 × 62 × 26 mm" }
      ]
    }
  ];

  const features = [
    {
      icon: Cpu,
      title: "Powerful Processing",
      description: "Quad-core Cortex-A72 CPU provides sufficient performance for AR proof-of-concept applications."
    },
    {
      icon: Camera,
      title: "High-Quality Imaging",
      description: "12.3MP camera with autofocus captures clear images for AR object recognition and tracking."
    },
    {
      icon: Eye,
      title: "Compact Display",
      description: "2.8-inch touchscreen provides intuitive interaction with AR elements in a portable form factor."
    },
    {
      icon: Headphones,
      title: "Wireless Audio",
      description: "BOYA wireless microphone enables voice commands while maintaining mobility."
    },
    {
      icon: Battery,
      title: "Extended Battery Life",
      description: "20,000 mAh power bank ensures all-day operation for field testing."
    },
    {
      icon: Wifi,
      title: "Connectivity Options",
      description: "Multiple interfaces including HDMI, USB 3.0, and GPIO for flexible component integration."
    }
  ];

  const useCases = [
    {
      title: "Education & Learning",
      description: "Demonstrate AR concepts in classrooms with affordable, locally available components.",
      image: "🎓"
    },
    {
      title: "Prototype Development",
      description: "Build and test AR applications with accessible hardware before scaling to production.",
      image: "💻"
    },
    {
      title: "Field Research",
      description: "Portable system enables AR data collection and visualization in various environments.",
      image: "🌍"
    },
    {
      title: "Accessible AR",
      description: "Prove AR concepts can be implemented with cost-effective, widely available components.",
      image: "👥"
    }
  ];

  const toggleView = () => {
    setShowDesign(!showDesign);
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AR Prototype System
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                A practical augmented reality prototype built with accessible components. 
                Demonstrates AR capabilities using cost-effective, locally available hardware.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/contact"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <span>Contact to Learn More</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">12.3MP</div>
                  <div className="text-gray-400 text-sm">Camera Resolution</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">8GB</div>
                  <div className="text-gray-400 text-sm">RAM Capacity</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">20Ah</div>
                  <div className="text-gray-400 text-sm">Battery Capacity</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Interactive Product Display */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-3xl animate-pulse"></div>
                
                {/* Flip Container */}
                <div 
                  className="relative z-10 cursor-pointer group"
                  onClick={toggleView}
                  style={{ perspective: '1000px' }}
                >
                  <div 
                    className={`relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d ${
                      showDesign ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front Side - Product Image */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                      <img
                        src="https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="AR Prototype System"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6 text-center">
                        <h3 className="text-xl font-bold text-white mb-2">AR Prototype System</h3>
                        <p className="text-gray-300 text-sm">Click to see technical design</p>
                      </div>
                      {/* Flip indicator */}
                      <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-full">
                        <RotateCcw className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Back Side - 2D Design */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl">
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border-2 border-blue-400/30 shadow-2xl h-full flex flex-col justify-center">
                        <div className="w-full h-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl border border-blue-400/50 flex items-center justify-center space-x-12 relative overflow-hidden mb-6">
                          {/* Components */}
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400/40 to-cyan-400/40 rounded-lg border-2 border-blue-400 relative flex items-center justify-center">
                            <Cpu className="h-6 w-6 text-blue-300" />
                          </div>
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/40 to-blue-400/40 rounded-lg border-2 border-cyan-400 relative flex items-center justify-center">
                            <Camera className="h-6 w-6 text-cyan-300" />
                          </div>
                          
                          {/* Tech indicators */}
                          <div className="absolute top-2 left-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="absolute top-2 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white mb-2">Technical Design</div>
                          <div className="text-sm text-blue-400 mb-4">Practical AR Prototype</div>
                          <p className="text-gray-300 text-sm">Click to see product photo</p>
                        </div>
                        
                        {/* Flip indicator */}
                        <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-full">
                          <RotateCcw className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Click instruction */}
                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">
                    Click to flip between product photo and technical design
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'specs', label: 'Specifications' },
              { id: 'features', label: 'Features' },
              { id: 'use-cases', label: 'Use Cases' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'specs' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Technical Specifications
                  </span>
                </h2>
                <p className="text-xl text-gray-400">Practical components selected for accessibility and performance</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {specifications.map((category, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-blue-400 mb-4">{category.category}</h3>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-start">
                          <span className="text-gray-300 text-sm">{item.label}</span>
                          <span className="text-white text-sm font-medium text-right ml-4">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Key Features
                  </span>
                </h2>
                <p className="text-xl text-gray-400">Balanced performance and practicality</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'use-cases' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Practical Applications
                  </span>
                </h2>
                <p className="text-xl text-gray-400">Demonstrating AR capabilities with accessible hardware</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="group p-8 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-6xl mb-6 text-center">{useCase.image}</div>
                    <h3 className="text-2xl font-semibold text-white mb-4 text-center">{useCase.title}</h3>
                    <p className="text-gray-300 text-center leading-relaxed">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Interested in AR Prototyping?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Learn how to build affordable AR systems with accessible components. 
            Contact us for more information about this prototype and its implementation.
          </p>
          
          <Link
            to="/contact"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>Get in Touch</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <DownloadSection />

      <style>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
      <Footer/>
      <ChatBot/>
    </div>
  );
};

export default Product;