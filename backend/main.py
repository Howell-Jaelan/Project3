import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=['*'],
                    allow_methods = ['*'], allow_headers=['*'])

# load both files once when FastAPI starts
model = joblib.load('worldcup_model.pkl')
team_stats = pd.read_csv('team_stats.csv')

print("Columns in team_stats.csv:")
print(team_stats.columns.tolist())
print("\nFirst few rows:")
print(team_stats.head())
print("\nAll teams available:")
print(team_stats["home_team"].unique())

# React only needs to send team names and tournament
class MatchInput(BaseModel):
    home_team: str
    away_team: str
    tournament: str

@app.post('/predict')
def predict(match: MatchInput):
    try:
        # look up stats automatically from the CSV
        home_stats = team_stats[team_stats['home_team'] == match.home_team]
        away_stats = team_stats[team_stats['home_team'] == match.away_team]
    
        # handle a case where a team is not found
        if home_stats.empty or away_stats.empty:
            return 'Error, team not found in database'

        home_stats = home_stats.iloc[0]
        away_stats = away_stats.iloc[0]

        print("Home stats found:", home_stats.to_dict())
        print("Away stats found:", away_stats.to_dict())

        # Build the feature row the model expects
        input_df = pd.DataFrame([{'home_team': match.home_team,
                             'away_team': match.away_team,
                             'tournament': match.tournament,
                             'home_win_rate':home_stats['home_win_rate'],
                             'away_win_rate':away_stats['away_win_rate'],
                             'home_avg_goal_diff': home_stats['home_avg_goal_diff'],
                             'away_avg_goal_diff': away_stats['home_avg_goal_diff'],  
                             'home_recent_form': home_stats['home_recent_form'],
                             'away_recent_form': away_stats['away_recent_form'],
                             'h_to_h_home_win_rate': home_stats['h_to_h_home_win_rate'],
                             'home_draw_rate': home_stats['home_draw_rate'],
                             'away_draw_rate': away_stats['away_draw_rate'],
                             'home_ranking': home_stats['home_ranking'],
                             'away_ranking': away_stats['home_ranking'],
                             'ranking_diff': home_stats['home_ranking'] - away_stats['home_ranking'],
                             'match_compare': abs(home_stats['home_ranking']-away_stats['home_ranking']),
                             'neutral': 1}])
    
        print('Input DataFrame:')
        print(input_df)
        # run prediction
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0]

        result_map = {0: 'Away Win', 1: 'Draw', 2: 'Home Win'}

        return {
            'prediction': result_map[int(prediction)],
            'away_win_probability': round(float(probability[0]), 2),
            'draw_probability': round(float(probability[1]),2),
            'home_win_probability': round(float(probability[2]),2) }

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {'error': str(e)}





