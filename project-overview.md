# SmartAgri Zambia — Project Overview

## Core Goal
Support small-scale and commercial farmers in Zambia using mobile technology and AI to provide accurate weather forecasting, smarter farming decisions, and improved crop productivity and climate resilience.

## Problem Statement
- Farmers rely on unreliable or generalized weather information
- Climate change has made rainfall patterns unpredictable
- Many farmers lack access to timely agricultural insights
- Poor decisions on planting, irrigation, and harvesting lead to losses

## Solution
A mobile application integrated with AI and weather data delivering:
- Localized weather forecasts
- Actionable farming recommendations
- Easy access via low-cost smartphones

## Platform
- Mobile App (Android-first focus)
- Designed for low data usage
- Simple UI for farmers with varying literacy levels

## AI & Technology Components

### Weather Forecasting (AI-driven)
- Historical + real-time meteorological data
- ML models (potential LSTM / time-series forecasting) to predict rainfall probability, temperature trends, drought/flood risk
- Location-specific forecasts (not national averages)

### Smart Farming Recommendations
- Best planting times
- Irrigation scheduling
- Fertilizer application timing
- Harvest period suggestions

## Target Users
- Small-scale and rural farmers
- Agricultural cooperatives
- Extension officers (future integration)

## Local Context
- Tailored for Zambian climate and farming conditions
- Supports local crops: Maize, Groundnuts, Beans, Sorghum, Cassava, Sunflower (Rice planned)
- Designed with connectivity challenges in mind (offline access for previously loaded data)

## Planned Features
- Weather alerts (rain, heat, storms)
- Seasonal farming calendar
- Crop-specific tips
- Offline access
- Future: SMS alerts, Government/NGO program integration

## Long-Term Vision
- Pest prediction
- Soil analysis
- National digital farming companion
- Support food security and sustainable agriculture in Zambia

## Tech Stack (Current Prototype)
- React (JSX) for UI prototyping
- Anthropic Claude API for the AI Farm Advisor chat feature
- CSS-in-JS for styling

## Planned Tech Stack (Production)
- **Android App**: Java (Android Studio) — revising core Java/OOP concepts
- **Backend**: Java Spring Boot REST API
- **AI Integration**: Claude API called from Java backend
- **Data**: Weather API integration, local SQLite/Room caching for offline support
