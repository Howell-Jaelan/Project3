import { useState } from "react";
import TeamSelector from "./components/TeamSelector";
import PredictButton from "./components/PredictButton";
import ResultCard from "./components/ResultCard";
import "./App.css";

const TEAMS = [
  "Algeria", "Argentina", "Australia", "Austria", "Belgium",
  "Brazil", "Canada", "Cape Verde", "Colombia", "Croatia", "Curaçao",
  "Egypt", "England", "France", "Germany", "Ghana", "Haiti", "Iran",
  "Japan", "Jordan", "Mexico", "Morocco", "Netherlands",
  "New Zealand", "Norway", "Panama", "Paraguay", "Portugal", "Qatar",
  "Saudi Arabia", "Scotland", "Senegal", "South Africa", "South Korea",
  "Spain", "Switzerland", "Tunisia", "USA", "Uzbekistan"
];

const USE_MOCK = false;

function App() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) {
      setError("Please select both teams before predicting.");
      return;
    }
    if (homeTeam === awayTeam) {
      setError("Please select two different teams.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let data;
      if (USE_MOCK) {
        await new Promise((res) => setTimeout(res, 1000));
        data = {
          prediction: "Home Win",
          home_win_probability: 0.64,
          away_win_probability: 0.21,
          draw_probability: 0.15,
        };
      } else {
        const response = await fetch("http://localhost:8001/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            home_team: homeTeam,
            away_team: awayTeam,
            tournament: "FIFA World Cup",
          }),
        });
        data = await response.json();
      }
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Could not connect to server. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <header className="app-header">
          <div className="header-icon">⚽</div>
          <h1 className="header-title">2026 FIFA World Cup Predictor</h1>
          <p className="header-subtitle">
            Select two national teams and let the model predict the outcome
          </p>
        </header>

        <div className="card selector-card">
          <div className="selector-grid">
            <div className="selector-col">
              <TeamSelector
                label="Home Team"
                teams={TEAMS}
                selected={homeTeam}
                onChange={(val) => { setHomeTeam(val); setResult(null); setError(null); }}
              />
            </div>
            <div className="vs-divider">VS</div>
            <div className="selector-col">
              <TeamSelector
                label="Away Team"
                teams={TEAMS}
                selected={awayTeam}
                onChange={(val) => { setAwayTeam(val); setResult(null); setError(null); }}
              />
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <PredictButton onClick={handlePredict} loading={loading} />
        </div>

        {result && (
          <ResultCard result={result} homeTeam={homeTeam} awayTeam={awayTeam} />
        )}

        <footer className="app-footer">
          <span>Predictions powered by XGBoost — trained on historical FIFA match data</span>
          <span>Brought to you by JP & Jaelan · Spring 2026</span>
        </footer>
      </div>
    </div>
  );
}

export default App;