# Debugging: Alternative MongoDB URI formats

# Current URI (if this fails, try alternatives below):
MONGODB_URI=mongodb+srv://mdkaif1590_db_user:uxuUuup7ogJs6LoO@clusterpsmanager.8gl0ll0.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPSManager

# Alternative 1: Without appName
MONGODB_URI=mongodb+srv://mdkaif1590_db_user:uxuUuup7ogJs6LoO@clusterpsmanager.8gl0ll0.mongodb.net/?retryWrites=true&w=majority

# Alternative 2: With explicit database name
MONGODB_URI=mongodb+srv://mdkaif1590_db_user:uxuUuup7ogJs6LoO@clusterpsmanager.8gl0ll0.mongodb.net/password-manager?retryWrites=true&w=majority

# Alternative 3: URL encoded password (if password has special characters)
MONGODB_URI=mongodb+srv://mdkaif1590_db_user:uxuUuup7ogJs6LoO@clusterpsmanager.8gl0ll0.mongodb.net/password-manager?retryWrites=true&w=majority&authSource=admin