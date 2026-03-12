import { useState } from 'react'

function Settings() {
  const [darkMode, setDarkMode] = useState(false)

  const handleToggle = () => {
    setDarkMode(!darkMode)
  }

  return (
    <main className="page">
      <h1>Settings</h1>
      <p>Configure your application preferences here.</p>
      
      <div className="setting-item">
        <label htmlFor="dark-mode-toggle">
          <input
            type="checkbox"
            id="dark-mode-toggle"
            checked={darkMode}
            onChange={handleToggle}
          />
          Dark Mode {darkMode ? '(Enabled)' : '(Disabled)'}
        </label>
      </div>
    </main>
  )
}

export default Settings