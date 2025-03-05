# Import necessary libraries
from flask import Flask, request, jsonify # type: ignore
import joblib # type: ignore
import pandas as pd # type: ignore
from sklearn.ensemble import RandomForestClassifier # type: ignore
from sklearn.model_selection import train_test_split # type: ignore
from lime.lime_tabular import LimeTabularExplainer # type: ignore
from flask_cors import CORS # type: ignore

# Step 1: Prepare the Dataset (Updated with 'is_prohibited' feature)
data = pd.DataFrame({
    'origin': ['USA', 'India', 'Germany', 'China', 'Brazil', 'France', 'USA', 'India', 'Germany', 'India'],
    'destination': ['India', 'Germany', 'USA', 'India', 'France', 'USA', 'China', 'Brazil', 'France', 'Singapore'],
    'hscode': [1234, 5678, 9101, 2345, 1122, 3344, 7788, 9900, 5566, 4433],
    'weight': [10, 20, 30, 40, 15, 25, 35, 45, 12, 18],
    'type': ['perishable', 'non-perishable', 'perishable', 'non-perishable', 'perishable', 
             'non-perishable', 'perishable', 'non-perishable', 'perishable', 'non-perishable'],
    'is_prohibited': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],  # 1 = contains prohibited items, 0 = does not
    'compliance': [1, 0, 0, 0, 1, 0, 1, 0, 1, 1]  # Non-compliant for prohibited items
})

# Encode categorical variables
data_encoded = pd.get_dummies(data, columns=['origin', 'destination', 'type'])
X = data_encoded.drop('compliance', axis=1)
y = data_encoded['compliance']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 2: Build and Train the Model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, 'compliance_model.pkl')

# Step 3: Set Up LIME Explainer
explainer = LimeTabularExplainer(
    training_data=X_train.values,
    feature_names=X_train.columns.tolist(),
    class_names=['Non-compliant', 'Compliant'],
    mode='classification'
)

# Step 4: Deploy the Model Using Flask
app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    # Define prohibited HS codes
    prohibited_hs_codes = [9303, 9304, 9305, 9023]

    # Parse input data
    data = request.json
    print(data)
    input_data = pd.DataFrame([data])

    # Check for prohibited HS codes
    if input_data.loc[0, 'hscode'] in prohibited_hs_codes:
        return jsonify({
            'prediction': 0,
            'probability': 0,
            'explanation': f"Shipment contains prohibited items (HS Code: {input_data.loc[0, 'hscode']}) and is non-compliant."
        })

    # Align input data columns with training data columns
    input_data_encoded = pd.get_dummies(input_data)
    missing_cols = set(X_train.columns) - set(input_data_encoded.columns)
    for col in missing_cols:
        input_data_encoded[col] = 0
    input_data_encoded = input_data_encoded[X_train.columns]

    # Predict compliance
    prediction = model.predict(input_data_encoded)[0]
    proba = model.predict_proba(input_data_encoded)[0]

    # Generate LIME explanation
    explanation = explainer.explain_instance(
        input_data_encoded.values[0], model.predict_proba
    )
    explanation_list = explanation.as_list()

    # Return prediction and explanation
    return jsonify({
        'prediction': int(prediction),
        'probability': proba.tolist(),
        'explanation': explanation_list
    })



if __name__ == '__main__':
    app.run(debug=True, port=3000)

