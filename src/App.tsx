import PomodoroTimer from './components/PomodoroTimer'
import Clock from './components/Clock'
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="app">
        <PomodoroTimer />
        <Clock />
      </div>
    </>
  )
}

export default App