import { useState } from "react";
import TeamSelector from "./components/TeamSelector";
import PredictButton from "./components/PredictButton";
import ResultCard from "./components/ResultCard";
import "./App.css";

const TEAMS = [
  "Brazil", "Argentina", "France", "Germany", "Spain",
  "England", "Portugal", "Netherlands", "Italy", "Belgium",
  "Uruguay", "Colombia", "Mexico", "USA", "Japan",
  "South Korea", "Senegal", "Morocco", "Croatia", "Denmark",
  "Switzerland", "Australia", "Ghana", "Cameroon", "Serbia",
  "Poland", "Ecuador", "Tunisia", "Costa Rica", "Canada",
  "Qatar", "Saudi Arabia", "Iran", "Nigeria"
];

const USE_MOCK = true;

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
          <h1 className="header-title">FIFA World Cup 2026 Predictor</h1>
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
          <span>Created by JP & Jaelan · Spring 2026</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
