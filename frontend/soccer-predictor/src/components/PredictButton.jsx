function PredictButton({ onClick, loading }) {
  return (
    <button className="predict-btn" onClick={onClick} disabled={loading}>
      {loading ? (
        <>
          <span className="spinner" />
          Analyzing match...
        </>
      ) : (
        "Predict Match Outcome"
      )}
    </button>
  );
}

export default PredictButton;
