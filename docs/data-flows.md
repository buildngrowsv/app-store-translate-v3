# Data Flows

This document outlines the key data flows within the ReachMix application.

## Authentication Flow

1. **User Registration**
   ```
   User Input -> SignUp Component -> AuthContext -> AuthService -> In-Memory Storage
   ```
   - User provides email and password
   - Data validated in SignUp component
   - AuthContext handles registration request
   - AuthService creates user in memory
   - User redirected to dashboard

2. **User Login**
   ```
   User Input -> Login Component -> AuthContext -> AuthService -> In-Memory Storage
   ```
   - User enters credentials
   - Login component validates input
   - AuthContext processes login request
   - AuthService verifies credentials
   - User session stored in localStorage
   - User redirected to dashboard

## Project Creation Flow

1. **Enhancement Project**
   ```
   ProjectWizard -> ProjectDetails -> ProjectType -> AuthContext -> OpenAI Service
   ```
   - User enters project details (name, description, keywords)
   - Selects "Enhance" project type
   - Project created through AuthContext
   - OpenAI Service processes enhancement request
   - Results displayed to user

2. **Translation Project**
   ```
   ProjectWizard -> ProjectDetails -> ProjectType -> LanguageSelection -> AuthContext -> OpenAI Service
   ```
   - User enters project details
   - Selects "Translate" project type
   - Chooses target languages (up to 3 in trial)
   - Project created through AuthContext
   - OpenAI Service processes translation requests
   - Results displayed for each language

## Content Generation Flow

1. **Enhancement Processing**
   ```
   Project Data -> OpenAI Service -> AI Processing -> Results Storage -> Display
   ```
   - Project details sent to OpenAI
   - System prompt for enhancement
   - AI generates optimized content
   - Results stored with project
   - Content displayed in ResultsView

2. **Translation Processing**
   ```
   Project Data -> OpenAI Service -> AI Processing -> Results Storage -> Display
   ```
   - Project details sent to OpenAI
   - System prompt for translation
   - AI translates content for each language
   - Results stored with project
   - Translations displayed in ResultsView

## Results Management Flow

1. **Results Generation**
   ```
   ProjectResults -> OpenAI Service -> Project Storage -> ResultsView
   ```
   - Results processing initiated
   - OpenAI Service generates content
   - Results stored with project
   - Loading state managed
   - Results displayed when ready

2. **Results Display**
   ```
   ResultsView -> Content Display -> Copy/Save Actions
   ```
   - Results retrieved from project
   - Content displayed by type
   - Copy functionality for sections
   - Save option for final results

## Data Storage Flow

1. **User Data**
   ```
   AuthService -> In-Memory Storage -> localStorage
   ```
   - User data stored in memory
   - Session info in localStorage
   - Needs migration to proper backend

2. **Project Data**
   ```
   Project -> AuthService -> User Projects -> Results
   ```
   - Projects stored with user data
   - Results attached to projects
   - All data currently in memory
   - Needs persistent storage solution

## Free Trial Limitations

1. **Language Selection**
   ```
   LanguageSelection -> Trial Check -> Upgrade Modal
   ```
   - Maximum 3 languages in trial
   - Language count checked
   - Upgrade modal for excess
   - Prevents additional selections

2. **Project Creation**
   ```
   ProjectWizard -> Trial Validation -> Project Processing
   ```
   - Trial limitations enforced
   - Project type restrictions
   - Language count validation
   - Upgrade prompts when needed

## Areas for Improvement

1. **Data Persistence**
   - Implement proper backend storage
   - Add database for user and project data
   - Implement proper session management

2. **API Security**
   - Add API authentication
   - Implement rate limiting
   - Secure OpenAI API usage

3. **Error Handling**
   - Add comprehensive error tracking
   - Implement retry mechanisms
   - Add user feedback systems 