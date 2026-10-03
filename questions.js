window.QUIZ_QUESTIONS = [
  {
    "id": 1,
    "topic": "Learning types",
    "prompt": "A hospital has blood test results for 2,000 patients, each labeled with a known diagnosis. It wants to predict the diagnosis of new patients. What type of learning is this?",
    "options": ["Reinforcement learning", "Unsupervised learning: clustering", "Supervised learning: regression", "Supervised learning: classification"],
    "correctIndex": 3,
    "explanation": "The model learns from examples with known labels. A diagnosis is a category, so this is supervised classification."
  },
  {
    "id": 2,
    "topic": "Data leakage",
    "prompt": "A platform wants to predict, at the moment a flat is listed, how many days it will take to sell. Which feature would cause data leakage?",
    "options": ["The asking price at the time of listing", "The district", "The final sale price", "The number of rooms"],
    "correctIndex": 2,
    "explanation": "The final sale price is only known after the sale. It would give the model information that is unavailable when a new listing is created."
  },
  {
    "id": 4,
    "topic": "Data quality",
    "prompt": "A city column contains both 'New York' and 'new york'. Which data-quality issue is this?",
    "options": ["Missing data", "Unit inconsistency", "Values out of range", "Inconsistent categories"],
    "correctIndex": 3,
    "explanation": "The same category is written in different ways. Normalize capitalization and spelling so both values represent one city."
  },
  {
    "id": 5,
    "topic": "Train/test splitting",
    "prompt": "Only 3% of the labels belong to the positive class, and the test set has 150 rows. Why is stratification especially useful here?",
    "options": ["Stratification makes the model perfect at predicting rare classes", "Stratification increases the number of positive examples in the whole dataset", "Only about 4–5 positive rows are expected in the test set, so a random split could leave the rare class poorly represented", "It does not matter because training can learn both classes"],
    "correctIndex": 2,
    "explanation": "150 × 0.03 = 4.5, so there are only about 4–5 positive test examples. Stratification preserves class proportions and makes evaluation more dependable."
  },
  {
    "id": 6,
    "topic": "Data leakage",
    "prompt": "What is wrong with this preprocessing code?",
    "code": "scaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)  # X contains all rows\nX_train, X_test, y_train, y_test = train_test_split(\n    X_scaled, y, test_size=0.2, random_state=42\n)",
    "options": ["Nothing: scaling does not use the target, so it cannot leak information", "StandardScaler cannot be applied before a model is fitted", "The scaler learned means and standard deviations from all rows, including the test set", "test_size must be at least 0.3"],
    "correctIndex": 2,
    "explanation": "The scaler uses information from the test set before evaluation. Split first, fit the scaler only on X_train, then use that fitted scaler to transform both train and test data."
  },
  {
    "id": 7,
    "topic": "Feature preprocessing",
    "prompt": "A ColumnTransformer scales 4 numeric columns and one-hot encodes 2 categorical columns. The first categorical column has 3 categories and the second has 2. No categories are dropped or merged, and no other columns are passed through. How many columns does the transformed table have?",
    "answer": 9,
    "answerDisplay": "9",
    "explanation": "Scaling keeps the 4 numeric columns. One-hot encoding adds 3 + 2 columns, giving 4 + 3 + 2 = 9."
  },
  {
    "id": 8,
    "topic": "Model evaluation",
    "prompt": "Why does scikit-learn return negative values for neg_mean_absolute_error?",
    "options": ["Because MAE becomes negative when a model is very good", "Because the model underpredicts on average", "Scikit-learn makes larger scores better, so an error measure is returned with a minus sign", "Because the errors are below the mean"],
    "correctIndex": 2,
    "explanation": "Scikit-learn scorers follow a higher-is-better convention. Negating MAE makes a smaller error produce a larger score: −2 is better than −10. MAE itself is nonnegative."
  },
  {
    "id": 9,
    "topic": "Underfitting and overfitting",
    "prompt": "A model reaches training accuracy 0.61 and cross-validation accuracy 0.60, while other models reach 0.90 on the same data. What is the most likely diagnosis?",
    "options": ["Leakage from the test set", "Nothing is wrong because training and validation agree", "Overfitting", "Underfitting: the model is too simple"],
    "correctIndex": 3,
    "explanation": "Both training and validation performance are poor, and other models do much better. The model is failing to capture useful patterns, which suggests underfitting."
  },
  {
    "id": 10,
    "topic": "Statistics",
    "prompt": "Compute the sample variance of y = {0, 2, 4, 6, 8}, dividing by n − 1. Round to 2 decimal places and use a dot as the decimal separator.",
    "answer": 10,
    "answerDisplay": "10.00",
    "explanation": "The mean is 4. The squared deviations sum to 16 + 4 + 0 + 4 + 16 = 40. Divide by n − 1 = 4 to get 10.00.",
    "note": "The photographed dataset was reconstructed as {0, 2, 4, 6, 8}; the small text is not completely clear."
  },
  {
    "id": 11,
    "topic": "Linear regression",
    "prompt": "A fitted line is predicted price = 46.2 − 0.0074 × distance, where distance is in meters. What price does it predict at 1,000 meters? Round to 2 decimal places and use a dot as the decimal separator.",
    "answer": 38.8,
    "answerDisplay": "38.80",
    "explanation": "Substitute distance = 1,000: 46.2 − 0.0074 × 1,000 = 46.2 − 7.4 = 38.80."
  },
  {
    "id": 12,
    "topic": "Linear regression",
    "prompt": "For x = {1, 2, 3} and y = {2, 4, 5}, compute the least-squares slope b₁ = Sxy / Sxx. Round to 2 decimal places and use a dot as the decimal separator.",
    "answer": 1.5,
    "answerDisplay": "1.50",
    "explanation": "The means are x̄ = 2 and ȳ = 11/3. Sxy = Σ(x − x̄)(y − ȳ) = 3, and Sxx = Σ(x − x̄)² = 2. The slope is 3/2 = 1.50."
  },
  {
    "id": 13,
    "topic": "Regression residuals",
    "prompt": "Using residual = actual − predicted, a residual of −7.7 means that the model…",
    "options": ["Predicted too high: it overpredicted by 7.7", "Has a mean error of −7.7 on all rows", "Was wrong by 7.7%", "Predicted too low: it underpredicted by 7.7"],
    "correctIndex": 0,
    "explanation": "actual − predicted = −7.7 means the prediction is 7.7 units greater than the actual value. This describes one residual, not a percentage or the mean error."
  },
  {
    "id": 14,
    "topic": "Model evaluation",
    "prompt": "A mean baseline (DummyRegressor) has a negative R² on the test set. What does this mean?",
    "options": ["R² cannot be negative, so this is a calculation error", "It performs worse than predicting the mean of the test set", "The baseline overfits", "The baseline explains all of the variance"],
    "correctIndex": 1,
    "explanation": "Negative R² means the predictions have more squared error than a constant prediction equal to the test-set mean. DummyRegressor learns the training-set mean, which may differ from the test-set mean.",
    "note": "The exact negative R² value is blurry in the photograph. Its sign is enough to answer the question."
  },
  {
    "id": 16,
    "topic": "Decision trees",
    "prompt": "A parent node has 50 samples of class A and 50 of class B. Split X creates children (40 A, 10 B) and (10 A, 40 B). Split Y creates children (20 A, 0 B) and (30 A, 50 B). Which split does a tree prefer using weighted Gini impurity?",
    "options": ["Split Y: its weighted Gini is 0.32, lower than 0.375 for X", "Split X: its weighted Gini is 0.32, lower than 0.375 for Y", "Neither, because both splits have the same weighted Gini", "Split Y, because one child is pure"],
    "correctIndex": 1,
    "explanation": "For X, both children have Gini 1 − 0.8² − 0.2² = 0.32. For Y, weighted Gini is (20/100) × 0 + (80/100) × [1 − (30/80)² − (50/80)²] = 0.375. Lower is better, so choose X."
  },
  {
    "id": 17,
    "topic": "Decision trees",
    "prompt": "Which of these is NOT a stopping criterion for growing a decision tree?",
    "options": ["The node contains more than two classes", "The node has fewer samples than the minimum allowed", "The node is pure", "The tree reaches its maximum depth"],
    "correctIndex": 0,
    "explanation": "A decision tree can split a node containing several classes. Sample limits, pure nodes, and maximum depth can stop further splitting."
  },
  {
    "id": 18,
    "topic": "K-nearest neighbors",
    "prompt": "KNN regression uses k = 3 and the plain, unweighted mean of neighbors. The five nearest neighbors of a new flat, sorted by distance, have prices 40, 44, 60, 38, and 52. What is the prediction?",
    "answer": 48,
    "answerDisplay": "48",
    "explanation": "Use the first three neighbors, because they are the closest by distance: (40 + 44 + 60) / 3 = 48. Do not choose the three lowest prices."
  },
  {
    "id": 19,
    "topic": "Support vector machines",
    "prompt": "A linear SVC is trained on scaled data. You delete 50 training points that are correctly classified and lie strictly outside the margin. You then train again with the same C and the same scaled values; the scaler is not refitted. What happens to the decision boundary?",
    "options": ["It moves toward the deleted points", "The model can no longer be trained", "It stays the same because the deleted points are not support vectors", "The margin becomes narrower because there is less data"],
    "correctIndex": 2,
    "explanation": "Correctly classified points strictly outside the margin are not support vectors and have zero weight in the SVM solution. Removing them does not change the boundary under the stated conditions, apart from possible numerical solver differences."
  },
  {
    "id": 20,
    "topic": "Feature scaling",
    "prompt": "A decision tree's performance is essentially unchanged after StandardScaler is applied. Why does this scaling not change the tree's splits?",
    "options": ["The tree uses Euclidean distance, but only on scaled data", "A tree compares each feature with a threshold; scaling preserves value order, so corresponding thresholds separate the same rows", "Scikit-learn turns every StandardScaler result into a Pipeline automatically", "The tree was already overfitting, so nothing could change it"],
    "correctIndex": 1,
    "explanation": "Standardization is an order-preserving transformation of each feature. A split x ≤ t becomes an equivalent split at a transformed threshold, so the same observations go to each side."
  }
]
;