import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { Timer, Plus, Play, Pause, RotateCcw, Trash2, X } from 'lucide-react';

export const MultiTimerDrawer = () => {
  const { timers, isTimerDrawerOpen, setIsTimerDrawerOpen, createTimer, toggleTimerPause, resetTimer, deleteTimer } = useKitchen();
  
  const [customName, setCustomName] = useState('');
  const [customMins, setCustomMins] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTimer = (e) => {
    e.preventDefault();
    const mins = parseInt(customMins, 10);
    if (isNaN(mins) || mins <= 0) return;
    createTimer(customName || 'Kitchen Timer', mins * 60);
    setCustomName('');
    setCustomMins('');
    setShowAddForm(false);
  };

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div 
        className={`timer-drawer-overlay ${isTimerDrawerOpen ? 'active' : ''}`}
        onClick={() => setIsTimerDrawerOpen(false)}
      />

      <div className={`timer-drawer ${isTimerDrawerOpen ? 'active' : ''}`}>
        <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
          <h4 className="font-serif mb-0 d-flex align-items-center">
            <Timer className="text-terracotta me-2" size={24} /> Kitchen Timers
          </h4>
          <button 
            className="btn-close" 
            onClick={() => setIsTimerDrawerOpen(false)}
          />
        </div>

        <div className="mb-3">
          {!showAddForm ? (
            <button 
              className="btn btn-auracook-primary w-100 d-flex align-items-center justify-content-center"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} className="me-1" /> Add Custom Timer
            </button>
          ) : (
            <form onSubmit={handleAddTimer} className="glass-panel p-3">
              <div className="mb-2">
                <input 
                  type="text" 
                  className="form-control form-control-sm"
                  placeholder="Timer Name (e.g. Pasta)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <input 
                  type="number" 
                  className="form-control form-control-sm"
                  placeholder="Duration (Minutes)"
                  value={customMins}
                  onChange={(e) => setCustomMins(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-auracook-primary btn-sm flex-grow-1">Start</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Preset Buttons */}
        <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
          <button className="btn btn-sm btn-outline-secondary text-nowrap" onClick={() => createTimer('Pasta Boiling', 8 * 60)}>8m Pasta</button>
          <button className="btn btn-sm btn-outline-secondary text-nowrap" onClick={() => createTimer('Sauce Simmer', 12 * 60)}>12m Sauce</button>
          <button className="btn btn-sm btn-outline-secondary text-nowrap" onClick={() => createTimer('Oven Roast', 20 * 60)}>20m Oven</button>
        </div>

        <div className="flex-grow-1 overflow-y-auto">
          {timers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Timer size={48} className="text-terracotta opacity-50 mb-3" />
              <p>No active timers running.</p>
            </div>
          ) : (
            timers.map(t => {
              const pct = Math.round((t.remainingSeconds / t.totalSeconds) * 100);
              return (
                <div key={t.id} className={`timer-card ${t.status === 'finished' ? 'finished' : ''}`}>
                  <div>
                    <div className="fw-bold text-dark mb-1">{t.name}</div>
                    <div className="timer-display-time">{formatTime(t.remainingSeconds)}</div>
                  </div>
                  <div className="d-flex gap-2">
                    {t.status !== 'finished' && (
                      <button className="btn btn-sm btn-light shadow-sm" onClick={() => toggleTimerPause(t.id)}>
                        {t.status === 'running' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    )}
                    <button className="btn btn-sm btn-light shadow-sm" onClick={() => resetTimer(t.id)}>
                      <RotateCcw size={16} />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTimer(t.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="timer-progress-bg" style={{ width: `${pct}%` }}></div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
