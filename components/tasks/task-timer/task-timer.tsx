"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Task Timer Component - MindEase
 * Pomodoro-style focus timer for tasks
 */
export interface TaskTimerProps {
  initialMinutes?: number;
  onComplete?: () => void;
}

export function TaskTimer({ initialMinutes = 25, onComplete }: TaskTimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        setIsRunning(false);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, onComplete]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  };

  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="p-4 rounded-md border border-border-subtle bg-surface-primary">
      <div className="text-center mb-4">
        <div className="text-4xl font-mono font-semibold text-text-primary">
          {displayTime}
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <Button onClick={handleStart} variant="primary">
            <Button.Text>Start</Button.Text>
          </Button>
        ) : (
          <Button onClick={handlePause} variant="secondary">
            <Button.Text>Pause</Button.Text>
          </Button>
        )}
        <Button onClick={handleReset} variant="ghost">
          <Button.Text>Reset</Button.Text>
        </Button>
      </div>
    </div>
  );
}

