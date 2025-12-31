import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-navy-800 mb-4 text-gradient">About Gov360</h1>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Empowering citizens through transparent communication and meaningful engagement
          </p>
        </div>

        <div className="space-y-8">
          
          <div className="card p-8 animate-slide-up">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-navy-800">Our Mission</h2>
            </div>
            <p className="text-navy-600 text-lg leading-relaxed">
              To provide a transparent and interactive platform for citizens to give feedback on Government of India news stories,
              fostering better communication and understanding between the government and the public. We believe in creating
              a bridge between governance and citizens through technology and open dialogue.
            </p>
          </div>

         
          <div className="card p-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-navy-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-navy-800">Our Objectives</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-navy-600">Collect comprehensive citizen feedback on government news</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-navy-600">Analyze sentiment and ratings in real-time</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-navy-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-navy-600">Promote transparency and accountability</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-navy-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-navy-600">Enhance citizen engagement in governance</p>
                </div>
              </div>
            </div>
          </div>

       
          <div className="card p-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-navy-800">Platform Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-orange-50 rounded-lg animate-bounce-subtle">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">360°</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-800">Comprehensive Feedback</h3>
                    <p className="text-sm text-navy-600">Multi-parameter rating system</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-navy-50 rounded-lg">
                  <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-navy-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-800">Real-time Updates</h3>
                    <p className="text-sm text-navy-600">Live analytics and notifications</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-800">Secure Platform</h3>
                    <p className="text-sm text-navy-600">Authentication and data protection</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-800">Responsive Design</h3>
                    <p className="text-sm text-navy-600">Works on all devices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-navy-800">Citizen Engagement</h2>
            </div>
            <div className="bg-gradient-to-r from-navy-50 to-orange-50 p-6 rounded-lg">
              <p className="text-navy-700 text-lg leading-relaxed mb-4">
                We believe in empowering citizens to voice their opinions and contribute to the democratic process.
                Your feedback helps shape better policies and communication strategies.
              </p>
              <div className="flex items-center text-navy-600">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">Your voice matters in governance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;