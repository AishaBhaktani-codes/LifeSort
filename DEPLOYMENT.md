# LifeSort Production Deployment Guide (Vercel + Render)

This document outlines the steps to deploy the LifeSort AI companion to a production environment using **Render** for the backend API and **Vercel** for the frontend.

## 1. Backend & AI Server (Render)

We use Render's **Free Tier** to host the Node.js backend. All heavy AI processing has been offloaded:
- **Audio Transcription**: Runs locally and offline inside Node.js using `@xenova/transformers` (takes very little RAM).
- **LLM/Generative AI**: Uses the serverless Hugging Face Inference API (`@huggingface/inference`) to call `meta-llama/Meta-Llama-3-8B-Instruct`.

### Steps to Deploy on Render:
1. Ensure your latest code is pushed to your GitHub repository.
2. Log in to the [Render Dashboard](https://dashboard.render.com).
3. Click **New +** and select **Blueprint**.
4. Connect your GitHub repository.
5. Render will detect the `render.yaml` file in the root directory and automatically configure your Web Service.
6. In the Render Dashboard, go to your new Web Service's **Environment** tab and add the missing variables (which cannot be synced automatically for security reasons):
   - `DATABASE_URL`: Your Supabase connection string.
   - `SUPABASE_URL`: Your Supabase project URL.
   - `SUPABASE_SERVICE_KEY`: Your Supabase Service Role key.
   - `HF_TOKEN`: Your Hugging Face API token.
   - `TEE_MASTER_SECRET`: Your 32-byte encryption secret.
7. Click **Deploy**. Render will build the Docker container and start the server.

---

## 2. Frontend (Vercel & EAS)

The frontend is built with React Native and Expo Router. You can deploy it to the web via Vercel, or build mobile apps via EAS.

### Web App Deployment (Vercel)
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** and select **Project**.
3. Import your GitHub repository.
4. **Configuration**:
   - **Root Directory**: Select `client`.
   - **Build Command**: `npx expo export -p web`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - Set `EXPO_PUBLIC_API_URL` to your Render backend URL (e.g., `https://lifesort-api.onrender.com`).
   - Set your `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
6. Click **Deploy**.

### Mobile App Build (EAS)
If you want to package the app for iOS or Android:
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Inside the `client` directory, run:
   - For Android: `eas build --platform android --profile production`
   - For iOS: `eas build --platform ios --profile production`

---

## 3. Database & Auth (Supabase)

- Ensure your `DATABASE_URL` connects to your production Supabase database.
- Configure Google OAuth credentials in the Supabase Dashboard (`Authentication -> Providers -> Google`).
- Make sure to update the **Site URL** and **Redirect URLs** in Supabase Auth settings to match your Vercel domain (e.g., `https://lifesort.vercel.app`) and your mobile app scheme.
