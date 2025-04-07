import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

// Function to generate a random bright color
const getRandomColor = () => {
  const brightColors = [
    '#FFB130', // Amber (original primary color)
    '#3498db', // Bright blue
    '#2ecc71', // Bright green
    '#e74c3c', // Bright red
    '#9b59b6', // Bright purple
    '#1abc9c', // Bright teal
    '#f1c40f', // Bright yellow
    '#e67e22'  // Bright orange
  ];
  return brightColors[Math.floor(Math.random() * brightColors.length)];
};

export default function Home() {
  // Generate random colors for each step number
  const stepColors = [
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor()
  ];

  return (
    <>
      <Head>
        <title>SkillConnect - AI-Powered Hiring Assistant</title>
        <meta name="description" content="SkillConnect delivers pre-vetted, context-fit candidates based on your actual goals, stage, and workflow." />
      </Head>

      <div className="w-full">
        {/* Hero Section with How It Works */}
        <section className="py-10 md:py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Hero Content - Left Column */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                Build Your Team Smarter, <span className="text-black">Not <span className="text-primary">Slower</span></span>
              </h1>
              <p className="text-xl text-text-secondary mb-6">
                Skip résumé piles, job boards, and generic tools. SkillConnect delivers pre-vetted, context-fit candidates based on your actual goals, stage, and workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/wizard" className="btn-primary hover:bg-gray-200 hover:text-black transition-colors">
                  Start New Hire Request
                </Link>
                <Link href="/dashboard" className="bg-gray-200 text-black hover:bg-gray-300 font-medium rounded-md py-2.5 px-5 flex items-center justify-center shadow-button transition-all duration-200">
                  View Dashboard
                </Link>
              </div>
            </div>
            
            {/* How It Works - Right Column */}
            <div className="bg-gray-200 text-black rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-5 text-black">
                Smarter Hiring in Four Steps
              </h2>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl text-black" style={{ backgroundColor: stepColors[0] }}>
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-0.5">Describe What You Need</h3>
                    <p className="text-gray-700 text-sm">Use our simple wizard to explain your team, goals, and where the hire fits.</p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl text-black" style={{ backgroundColor: stepColors[1] }}>
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-0.5">Let AI Find Your Match</h3>
                    <p className="text-gray-700 text-sm">We find candidates with the right stage-fit and skills—zero résumé roulette.</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl text-black" style={{ backgroundColor: stepColors[2] }}>
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-0.5">Meet with Confidence</h3>
                    <p className="text-gray-700 text-sm">Schedule interviews and let Scout, our AI assistant, join to take notes.</p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl text-black" style={{ backgroundColor: stepColors[3] }}>
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-0.5">Decide with Clarity</h3>
                    <p className="text-gray-700 text-sm">Get a summarized report with match score, risks, and key highlights.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Key Features
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start">
                  <div className="mr-3 text-4xl">🧠</div>
                  <div>
                    <div className="inline-block bg-primary rounded-full px-3 py-1 text-xs font-medium mb-1">
                      Built for How You Work
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Context-First Hiring Wizard</h3>
                    <p className="text-gray-600 text-sm">No more job descriptions. Just describe your business stage, hiring goals, and mission—we'll handle the fit.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start">
                  <div className="mr-3 text-4xl">🔔</div>
                  <div>
                    <div className="inline-block bg-primary rounded-full px-3 py-1 text-xs font-medium mb-1">
                      No Noise, Just Fit
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Real Match Alerts</h3>
                    <p className="text-gray-600 text-sm">Only see candidates when there's a real alignment. Never waste time sorting.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start">
                  <div className="mr-3 text-4xl">📊</div>
                  <div>
                    <div className="inline-block bg-primary rounded-full px-3 py-1 text-xs font-medium mb-1">
                      Compare What Matters
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Side-by-Side Comparison</h3>
                    <p className="text-gray-600 text-sm">Easily compare talent based on match score, values, past projects, and growth experience.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start">
                  <div className="mr-3 text-4xl">🤖</div>
                  <div>
                    <div className="inline-block bg-primary rounded-full px-3 py-1 text-xs font-medium mb-1">
                      Let Scout Handle the Details
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Interview Assistant: Scout</h3>
                    <p className="text-gray-600 text-sm">Our AI joins your interview, takes notes, and highlights what matters—so you focus on the person.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start">
                  <div className="mr-3 text-4xl">📋</div>
                  <div>
                    <div className="inline-block bg-primary rounded-full px-3 py-1 text-xs font-medium mb-1">
                      Clarity That Speeds You Up
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Decision-Ready Reports</h3>
                    <p className="text-gray-600 text-sm">AI-generated summaries break down each candidate's fit in an easy-to-share format.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start">
                  <div className="mr-3 text-4xl">🚀</div>
                  <div>
                    <div className="inline-block bg-primary rounded-full px-3 py-1 text-xs font-medium mb-1">
                      From Match to Offer, Faster
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Confident Hiring Decisions</h3>
                    <p className="text-gray-600 text-sm">Hire with clarity, not guesswork. Skip the drag. Start scaling.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-black text-white rounded-xl p-8 shadow-elevated text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Hire Without the Guesswork?
              </h2>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                SkillConnect helps startup teams fill roles faster—with people who truly fit their stage, mission, and work style.
              </p>
              <Link 
                href="/wizard" 
                className="inline-flex justify-center items-center px-8 py-3 bg-primary hover:bg-gray-200 text-white rounded-md font-semibold transition-colors text-base shadow-md"
              >
                Start Hiring Smarter
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 