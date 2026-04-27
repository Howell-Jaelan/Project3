function ResultCard({ result, homeTeam, awayTeam }) {
  const homeP = (result.home_win_probability * 100).toFixed(1);
  const drawP = (result.draw_probability * 100).toFixed(1);
  const awayP = (result.away_win_probability * 100).toFixed(1);

  const badgeClass =
    result.prediction === "Home Win"
      ? "result-outcome-badge badge-home"
      : result.prediction === "Away Win"
      ? "result-outcome-badge badge-away"
      : "result-outcome-badge badge-draw";

  const predictionLabel =
    result.prediction === "Home Win"
      ? `${homeTeam} Win`
      : result.prediction === "Away Win"
      ? `${awayTeam} Win`
      : "Draw";

  return (
    <div className="card result-card">
      <div className="result-matchup">
        <div className="result-matchup-teams">
          {homeTeam}
          <span className="vs">vs</span>
          {awayTeam}
        </div>
        <span className={badgeClass}>Predicted: {predictionLabel}</span>
      </div>

      <hr className="result-divider" />

      <div className="prob-section">
        <div className="prob-section-label">Win probability breakdown</div>
        <div className="prob-row">
          <div className="prob-item">
            <span className="prob-item-label">{homeTeam}</span>
            <div className="prob-bar-track">
              <div className="prob-bar-fill bar-home" style={{ width: `${homeP}%` }} />
            </div>
            <span className="prob-item-value">{homeP}%</span>
          </div>

          <div className="prob-item">
            <span className="prob-item-label">Draw</span>
            <div className="prob-bar-track">
              <div className="prob-bar-fill bar-draw" style={{ width: `${drawP}%` }} />
            </div>
            <span className="prob-item-value">{drawP}%</span>
          </div>

          <div className="prob-item">
            <span className="prob-item-label">{awayTeam}</span>
            <div className="prob-bar-track">
              <div className="prob-bar-fill bar-away" style={{ width: `${awayP}%` }} />
            </div>
            <span className="prob-item-value">{awayP}%</span>
          </div>
        </div>
      </div>

      <hr className="result-divider" />

      <div className="stat-row">
        <div className="stat-box">
          <div className={`stat-box-value stat-home`}>{homeP}%</div>
          <div className="stat-box-label">{homeTeam} Win</div>
        </div>
        <div className="stat-box">
          <div className={`stat-box-value stat-draw`}>{drawP}%</div>
          <div className="stat-box-label">Draw</div>
        </div>
        <div className="stat-box">
          <div className={`stat-box-value stat-away`}>{awayP}%</div>
          <div className="stat-box-label">{awayTeam} Win</div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
