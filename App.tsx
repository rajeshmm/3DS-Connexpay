import React, { useState, useEffect } from 'react';
import SequenceDiagram from './components/SequenceDiagram';
import IntegrationSimulator from './components/IntegrationSimulator';
import { generateFullPHPIntegration } from './services/geminiService';
import { FlowStatus } from './types';
import { DEFAULT_CONFIG, PHP_INIT_SNIPPET } from './constants';

const App: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<FlowStatus>(FlowStatus.IDLE);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'code'>('simulator');

  const handleFullCodeGeneration = async () => {
    setIsGenerating(true);
    try {
      const code = await generateFullPHPIntegration(DEFAULT_CONFIG);
      setGeneratedCode(code);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-indigo-600 h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xs">CP</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">ConnexPay 3DS Hub</h1>
            </div>
            <nav className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'simulator' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Simulation
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'code' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                PHP SDK
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {activeTab === 'simulator' ? (
              <>
                <section>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Integration Overview</h2>
                    <p className="text-slate-600 mt-1">Master the 3DS 2.x frictionless and challenge flows with our visual guides.</p>
                  </div>
                  <SequenceDiagram />
                </section>
                
                <section>
                  <IntegrationSimulator onStepChange={setCurrentStatus} />
                </section>
              </>
            ) : (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[600px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">PHP SDK Generator</h2>
                    <p className="text-sm text-slate-500">AI-powered complete implementation logic.</p>
                  </div>
                  <button 
                    onClick={handleFullCodeGeneration}
                    disabled={isGenerating}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {isGenerating ? 'Generating...' : 'Regenerate Full Class'}
                  </button>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm text-indigo-300 overflow-x-auto whitespace-pre">
                  {generatedCode || PHP_INIT_SNIPPET(DEFAULT_CONFIG)}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Environment Config</h3>
              <div className="space-y-3">
                {Object.entries(DEFAULT_CONFIG).map(([key, val]) => (
                  <div key={key}>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                    <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono text-slate-600 truncate">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h3 className="font-semibold text-indigo-900 mb-2">3DS Integration Checklist</h3>
              <ul className="space-y-3">
                {[
                  "Obtain Sales API Token",
                  "Gather Browser Information",
                  "Handle Challenge Redirects",
                  "Implement Webhook Listeners",
                  "Finalize Auth Request"
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-indigo-700">
                    <svg className="w-5 h-5 mr-2 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Required Webhooks</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-400 pl-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">Sale.3ds.pending.fingerprint</p>
                  <p className="text-sm text-slate-600">Issuer is gathering device data.</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">Sale.3ds.pending.challenge</p>
                  <p className="text-sm text-slate-600">User interaction (OTP/App) required.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">Sale.3ds.approved</p>
                  <p className="text-sm text-slate-600">Secure 3DS parameters ready for Sale.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
