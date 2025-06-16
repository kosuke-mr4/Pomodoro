import { useState, useEffect, useRef } from 'react'

export type TimerMode = 'work' | 'break' | 'longBreak'

interface UseTimerProps {
  workDuration: number
  breakDuration: number
  longBreakDuration: number
  longBreakInterval: number
}

export const useTimer = ({
  workDuration,
  breakDuration,
  longBreakDuration,
  longBreakInterval
}: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const getDuration = (currentMode: TimerMode): number => {
    switch (currentMode) {
      case 'work':
        return workDuration
      case 'break':
        return breakDuration
      case 'longBreak':
        return longBreakDuration
      default:
        return workDuration
    }
  }

  const getNextMode = (): TimerMode => {
    if (mode === 'work') {
      const nextPomodoroCount = completedPomodoros + 1
      return nextPomodoroCount % longBreakInterval === 0 ? 'longBreak' : 'break'
    }
    return 'work'
  }

  const start = () => {
    setIsRunning(true)
  }

  const pause = () => {
    setIsRunning(false)
  }

  const reset = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(mode))
  }

  const skip = () => {
    setIsRunning(false)
    const nextMode = getNextMode()
    if (mode === 'work') {
      setCompletedPomodoros(prev => prev + 1)
    }
    setMode(nextMode)
    setTimeLeft(getDuration(nextMode))
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // タイマー完了時の処理
      setIsRunning(false)
      const nextMode = getNextMode()
      
      if (mode === 'work') {
        setCompletedPomodoros(prev => prev + 1)
      }
      
      setMode(nextMode)
      setTimeLeft(getDuration(nextMode))
      
      // 通知音やアラートを追加可能
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${mode === 'work' ? 'ワーク' : '休憩'}時間が終了しました！`)
      }
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, mode, completedPomodoros, longBreakInterval])

  // 通知許可の要求
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    timeLeft,
    isRunning,
    mode,
    completedPomodoros,
    start,
    pause,
    reset,
    skip,
    formatTime: () => formatTime(timeLeft)
  }
}