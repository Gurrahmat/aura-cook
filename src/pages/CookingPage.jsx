import React, { useState, useEffect } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { Flame, Volume2, Timer, Wrench, Leaf, ArrowLeft, ArrowRight, CheckCircle, Mic, MicOff } from 'lucide-react';

export const CookingPage = () => {
  const { recipes, activeRecipeId, setCurrentPage, createTimer, addToast } = useKitchen();
  
  const currentRecipe = recipes.find(r => r.id === activeRecipeId) || recipes[0];
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const step = currentRecipe.instructions[currentStepIdx];
  const totalSteps = currentRecipe.instructions.length;
  const progressPct = Math.round(((currentStepIdx + 1) / totalSteps) * 100);

  // Text-To-Speech
  const readStepAloud = () => {
    if (!window.speechSynthesis) {
      addToast("Speech synthesis is not supported in this browser.", "warning");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Step ${step.step}. ${step.text}`);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API Voice Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastIndex = event.results.length - 1;
      const cmd = event.results[lastIndex][0].transcript.trim().toLowerCase();
      addToast(`Voice heard: "${cmd}"`, 'info');

      if (cmd.includes('next step') || cmd.includes('next')) {
        handleStepNavigation(1);
      } else if (cmd.includes('previous step') || cmd.includes('previous') || cmd.includes('back')) {
        handleStepNavigation(-1);
      } else if (cmd.includes('repeat') || cmd.includes('read step')) {
        readStepAloud();
      } else if (cmd.includes('start timer')) {
        const match = cmd.match(/(\d+)/);
        const mins = match ? parseInt(match[1], 10) : 5;
        createTimer(`Voice Timer (${mins}m)`, mins * 60);
      }
    };

    if (isListeningVoice) {
      try { recognition.start(); } catch (e) {}
    } else {
      try { recognition.stop(); } catch (e) {}
    }

    return () => {
      try { recognition.stop(); } catch (e) {}
    };
  }, [isListeningVoice, currentStepIdx]);

  const handleStepNavigation = (dir) => {
    if (dir === 1 && currentStepIdx === totalSteps - 1) {
      setShowCompletionModal(true);
      return;
    }
    setCurrentStepIdx(prev => {
      const next = prev + dir;
      if (next < 0) return 0;
      if (next >= totalSteps) return totalSteps - 1;
      return next;
    });
  };

  return (
    <div className="cooking-container container px-3 py-4">
      {/* Hero Card */}
      <div className="cooking-hero-card d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <span className="badge bg-terracotta text-white mb-2"><Flame size={12} className="me-1" /> Cooking In Progress</span>
          <h1 className="h2 font-serif text-white mb-1">{currentRecipe.title}</h1>
          <p className="text-white-50 mb-0 small">
            Prep: {currentRecipe.prepTime}m | Cook: {currentRecipe.cookTime}m | Servings: {currentRecipe.servings}
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 bg-white-10 p-2 rounded-3">
          <span className="text-white-50 small">Jump to step:</span>
          <select 
            className="form-select form-select-sm bg-dark text-white border-secondary"
            value={currentStepIdx}
            onChange={(e) => setCurrentStepIdx(parseInt(e.target.value, 10))}
          >
            {currentRecipe.instructions.map((inst, i) => (
              <option key={i} value={i}>Step {inst.step}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress mb-4" style={{ height: '8px', borderRadius: '4px' }}>
        <div className="progress-bar bg-terracotta" style={{ width: `${progressPct}%` }}></div>
      </div>

      {/* Step Card */}
      <div className="cooking-step-card">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="step-number-badge">{step.step}</div>
              <span className="text-muted fw-bold text-uppercase">Step {step.step} of {totalSteps}</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={readStepAloud}>
                <Volume2 size={14} className="me-1" /> Read Step
              </button>
              {step.timerMinutes > 0 && (
                <button 
                  className="btn btn-auracook-primary btn-sm"
                  onClick={() => createTimer(`Step ${step.step} Timer`, step.timerMinutes * 60)}
                >
                  <Timer size={14} className="me-1" /> Start {step.timerMinutes}m Timer
                </button>
              )}
            </div>
          </div>

          <div className="step-instruction-text">
            {step.text}
          </div>
        </div>

        {/* Tools & Ingredients */}
        <div>
          <div className="row g-3 border-top pt-3 mb-3">
            <div className="col-md-6">
              <small className="text-muted fw-bold text-uppercase d-block mb-2">
                <Wrench size={14} className="me-1 text-terracotta" /> Tools Needed:
              </small>
              <div className="step-tools-list">
                {step.tools && step.tools.length > 0 ? (
                  step.tools.map((t, idx) => (
                    <span key={idx} className="step-tool-tag">{t}</span>
                  ))
                ) : (
                  <span className="text-muted small">None specified</span>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted fw-bold text-uppercase d-block mb-2">
                <Leaf size={14} className="me-1 text-terracotta" /> Step Ingredients:
              </small>
              <div className="step-tools-list">
                {step.ingredients && step.ingredients.length > 0 ? (
                  step.ingredients.map((ing, idx) => (
                    <span key={idx} className="step-tool-tag bg-terracotta text-white border-0">{ing}</span>
                  ))
                ) : (
                  <span className="text-muted small">None specified</span>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between pt-2">
            <button 
              className="btn btn-auracook-secondary btn-lg"
              disabled={currentStepIdx === 0}
              onClick={() => handleStepNavigation(-1)}
            >
              <ArrowLeft size={18} className="me-2" /> Previous Step
            </button>

            <button 
              className={`btn btn-lg ${currentStepIdx === totalSteps - 1 ? 'btn-success' : 'btn-auracook-primary'}`}
              onClick={() => handleStepNavigation(1)}
            >
              {currentStepIdx === totalSteps - 1 ? (
                <>Complete Recipe <CheckCircle size={18} className="ms-2" /></>
              ) : (
                <>Next Step <ArrowRight size={18} className="ms-2" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Voice Assistant Widget */}
      <div className="voice-assistant-bar">
        <div className="d-flex align-items-center gap-3">
          <button 
            className={`voice-mic-btn ${isListeningVoice ? 'listening' : ''}`}
            onClick={() => {
              setIsListeningVoice(!isListeningVoice);
              addToast(isListeningVoice ? "Voice assistant deactivated" : "Voice assistant active! Speak 'Next' or 'Read step'", "info");
            }}
          >
            {isListeningVoice ? <Mic size={22} /> : <MicOff size={22} />}
          </button>
          <div>
            <div className="fw-bold text-dark mb-0">Hands-Free Voice Cooking Assistant</div>
            <small className="text-muted">
              {isListeningVoice ? "Voice Listening Active... Speak 'Next', 'Back', or 'Read step'" : "Click mic to enable Voice Controls"}
            </small>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered text-center">
            <div className="modal-content glass-panel p-4 border-0">
              <div className="mb-3">
                <CheckCircle size={64} className="text-terracotta mb-3" />
                <h2 className="font-serif">Bon Appétit! 🎉</h2>
                <p className="text-muted">You have successfully completed this recipe!</p>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-auracook-primary" onClick={() => { setShowCompletionModal(false); setCurrentPage('recipes'); }}>
                  Explore More Recipes
                </button>
                <button className="btn btn-outline-secondary" onClick={() => { setShowCompletionModal(false); setCurrentPage('home'); }}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
