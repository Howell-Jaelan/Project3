function TeamSelector({ label, teams, selected, onChange }) {
  return (
    <div className="selector-col">
      <label className="team-label">{label}</label>
      <select
        className="team-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a team</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TeamSelector;
