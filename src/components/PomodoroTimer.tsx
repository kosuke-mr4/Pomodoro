import { useTimer } from '../hooks/useTimer'
import './PomodoroTimer.css'

const PomodoroTimer = () => {
  const timer = useTimer({
    workDuration: 25 * 60, // 25分
    breakDuration: 5 * 60, // 5分
    longBreakDuration: 15 * 60, // 15分
    longBreakInterval: 4 // 4ポモドーロごとに長い休憩
  })

  const getModeText = () => {
    switch (timer.mode) {
      case 'work':
        return 'ワーク'
      case 'break':
        return '休憩'
      case 'longBreak':
        return '長い休憩'
      default:
        return 'ワーク'
    }
  }

  const getModeColor = () => {
    switch (timer.mode) {
      case 'work':
        return '#ff4757'
      case 'break':
        return '#2ed573'
      case 'longBreak':
        return '#3742fa'
      default:
        return '#ff4757'
    }
  }

  return (
    <div className="pomodoro-timer">
      <div className="timer-header">
        <div className="mode-indicator" style={{ backgroundColor: getModeColor() }}>
          {getModeText()}
        </div>
      </div>
      
      <div className="timer-display">
        <div className="time-text">{timer.formatTime()}</div>
        <div className="progress-ring">
          <svg className="progress-ring-svg" width="320" height="320">
            <circle
              className="progress-ring-circle-bg"
              stroke="var(--border-color)"
              strokeWidth="8"
              fill="transparent"
              r="150"
              cx="160"
              cy="160"
            />
            <circle
              className="progress-ring-circle"
              stroke={getModeColor()}
              strokeWidth="8"
              fill="transparent"
              r="150"
              cx="160"
              cy="160"
              style={{
                strokeDasharray: `${2 * Math.PI * 150}`,
                strokeDashoffset: `${2 * Math.PI * 150 * (1 - (timer.timeLeft / (timer.mode === 'work' ? 25 * 60 : timer.mode === 'break' ? 5 * 60 : 15 * 60)))}`
              }}
            />
          </svg>
        </div>
      </div>

      <div className="timer-controls">
        <button
          className={`control-btn ${timer.isRunning ? 'pause' : 'start'}`}
          onClick={timer.isRunning ? timer.pause : timer.start}
        >
          {timer.isRunning ? '⏸️' : '▶️'}
        </button>
        <button className="control-btn reset" onClick={timer.reset}>
          🔄
        </button>
        <button className="control-btn skip" onClick={timer.skip}>
          ⏭️
        </button>
      </div>

      <div className="timer-stats">
        <div className="stat">
          <span className="stat-label">完了したポモドーロ</span>
          <span className="stat-value">{timer.completedPomodoros}</span>
        </div>
      </div>
    </div>
  )
}

export default PomodoroTimer