# 🗄️ MongoDB Connection Setup Guide

## 📋 Summary of Changes

### Files Created:
1. **`backend/controller/data.controller.js`** - CRUD operations for issue management
2. **`backend/route/data.route.js`** - API endpoint definitions

### Files Modified:
3. **`backend/index.js`** - Added data routes registration
4. **`backend/models/data.model.js`** - Enhanced schema with new fields
5. **`frontend/src/components/ReportIssue.jsx`** - Added API integration

---

## 🔄 Connection Sequence (Step-by-Step)

### **STEP 1: MongoDB Database Setup**
**⏱️ Duration: 5-10 minutes**

#### Option A: MongoDB Atlas (Cloud - Recommended for beginners)
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in to your account
3. Create a new cluster (FREE tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
   Example: mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/
7. Replace <password> with your actual database password
8. Add database name at the end: ?retryWrites=true&w=majority
```

#### Option B: Local MongoDB Installation
```
1. Download MongoDB Community Server from mongodb.com
2. Install and start MongoDB service
3. Connection string: mongodb://localhost:27017/codevision
```

---

### **STEP 2: Configure Environment Variables**
**⏱️ Duration: 2 minutes**

1. **Check if `.env` file exists in `backend/` folder**
   ```powershell
   # Run in PowerShell
   cd backend
   ls .env
   ```

2. **If it doesn't exist, create it:**
   ```powershell
   New-Item .env -ItemType File
   ```

3. **Add these variables to `.env` file:**
   ```env
   # MongoDB Connection String
   MongoDBURL=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/codevision?retryWrites=true&w=majority
   
   # Server Port
   PORT=5001
   ```

   **⚠️ IMPORTANT:**
   - Replace `yourUsername` with your MongoDB username
   - Replace `yourPassword` with your MongoDB password
   - Replace `cluster0.xxxxx` with your actual cluster address
   - The database name is `codevision` (you can change this)

4. **Save the file**

---

### **STEP 3: Install Dependencies (if needed)**
**⏱️ Duration: 1-2 minutes**

```powershell
# Make sure you're in the backend directory
cd backend

# Check if node_modules exists
ls node_modules

# If it doesn't exist, run:
npm install
```

**Required packages** (already in package.json):
- ✅ express - Web framework
- ✅ mongoose - MongoDB ODM
- ✅ cors - Cross-origin resource sharing
- ✅ dotenv - Environment variables

---

### **STEP 4: Start Backend Server**
**⏱️ Duration: 1 minute**

```powershell
# Navigate to backend folder
cd backend

# Start the server
npm start

# OR for development with auto-reload:
npm run dev
```

**✅ Success indicators:**
```
Server is running on port 5001
✅ MongoDB connected successfully
```

**❌ Error indicators:**
```
❌ MongoDB not connected: ...
⚠️  Check your MongoDBURL in .env file
```

**Common errors and fixes:**
- **"MongoParseError"** → Check connection string format in .env
- **"Authentication failed"** → Check username/password in .env
- **"Network timeout"** → Check internet connection or MongoDB Atlas IP whitelist

---

### **STEP 5: Verify Backend is Working**
**⏱️ Duration: 2 minutes**

#### Option A: Using Browser
```
Open browser and visit:
http://localhost:5001/api/issues

Expected response:
{"success":true,"count":0,"data":[]}
```

#### Option B: Using PowerShell (curl)
```powershell
# Test GET all issues
Invoke-RestMethod -Uri "http://localhost:5001/api/issues" -Method GET

# Expected output: Empty array (no issues yet)
```

---

### **STEP 6: Start Frontend**
**⏱️ Duration: 1 minute**

```powershell
# Open a NEW PowerShell window (keep backend running)
cd frontend

# Install dependencies if needed
npm install

# Start development server
npm run dev
```

**✅ Frontend should start on:** `http://localhost:5173` (or similar)

---

### **STEP 7: Test the Complete Flow**
**⏱️ Duration: 3-5 minutes**

1. **Open your browser** to the frontend URL (e.g., http://localhost:5173)

2. **Navigate to the "Report Issue" page**

3. **Fill out the form:**
   - ✍️ Title: "Test Issue"
   - ✍️ Description: "Testing MongoDB connection"
   - 📍 Location: Double-click on map OR enter manually
   - 📊 Category: Select any category
   - ⚡ Priority: Select priority level

4. **Click "Submit Issue"**

5. **Check for success message:**
   ```
   ✅ Issue saved successfully!
   ```

6. **Verify in MongoDB:**
   - Option A: Check MongoDB Atlas → Browse Collections → "datas"
   - Option B: Use MongoDB Compass to view local database
   - Option C: Visit `http://localhost:5001/api/issues` in browser

---

## 🔍 Verification Checklist

Use this checklist to verify everything is working:

```
Backend Setup:
□ .env file exists in backend/ folder
□ MongoDBURL is correctly set in .env
□ Backend server starts without errors
□ Console shows "✅ MongoDB connected successfully"
□ http://localhost:5001/api/issues returns JSON response

Frontend Setup:
□ Frontend server is running
□ Can access the Report Issue page
□ No console errors in browser DevTools (F12)

Integration:
□ Form submits without errors
□ Success message appears after submission
□ Data appears in MongoDB database
□ GET request shows saved data
```

---

## 🎯 Data Flow Diagram

```
┌─────────────────┐
│   User fills    │
│   form in UI    │
│  (ReportIssue)  │
└────────┬────────┘
         │
         │ Submit button clicked
         ↓
┌─────────────────────────────────────┐
│  Frontend (ReportIssue.jsx)         │
│  handleSubmit() function            │
│  - Validates data                   │
│  - Creates issueData object         │
│  - fetch() POST request             │
└────────┬────────────────────────────┘
         │
         │ HTTP POST: localhost:5001/api/issues
         │ Content-Type: application/json
         │ Body: { title, description, category, ... }
         ↓
┌─────────────────────────────────────┐
│  Backend Server (index.js)          │
│  - Receives request                 │
│  - Routes to /api/issues endpoint   │
└────────┬────────────────────────────┘
         │
         │ Routes to data.route.js
         ↓
┌─────────────────────────────────────┐
│  Route Handler (data.route.js)      │
│  router.post('/', createIssue)      │
└────────┬────────────────────────────┘
         │
         │ Calls controller function
         ↓
┌─────────────────────────────────────┐
│  Controller (data.controller.js)    │
│  createIssue() function             │
│  - Validates required fields        │
│  - Creates new Data() instance      │
│  - Calls .save()                    │
└────────┬────────────────────────────┘
         │
         │ Mongoose save operation
         ↓
┌─────────────────────────────────────┐
│  Model (data.model.js)              │
│  - Validates against schema         │
│  - Prepares document                │
└────────┬────────────────────────────┘
         │
         │ MongoDB driver
         ↓
┌─────────────────────────────────────┐
│  MongoDB Database                   │
│  Collection: "datas"                │
│  ✅ Document saved!                 │
└────────┬────────────────────────────┘
         │
         │ Returns saved document
         ↓
┌─────────────────────────────────────┐
│  Response flows back                │
│  Backend → Frontend                 │
│  Success: true, data: {...}         │
└────────┬────────────────────────────┘
         │
         │ Response processed
         ↓
┌─────────────────────────────────────┐
│  Frontend Updates UI                │
│  ✅ "Issue saved successfully!"     │
│  Form clears after 2 seconds        │
└─────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Problem: "MongoDB not connected"
**Solutions:**
1. Check `.env` file exists in `backend/` folder
2. Verify `MongoDBURL` is correct
3. Ensure no extra spaces in connection string
4. For Atlas: Whitelist your IP (0.0.0.0/0 for development)
5. Check MongoDB cluster is running

### Problem: "Unable to connect to server" (Frontend)
**Solutions:**
1. Verify backend server is running (`npm start` in backend/)
2. Check backend is on port 5001
3. Look for CORS errors in browser console (F12)
4. Verify URL in ReportIssue.jsx is `http://localhost:5001/api/issues`

### Problem: "Network Error" when submitting
**Solutions:**
1. Backend must be running BEFORE testing frontend
2. Check firewall isn't blocking port 5001
3. Try accessing http://localhost:5001/api/issues in browser directly

### Problem: Data not appearing in MongoDB
**Solutions:**
1. Check backend console for save errors
2. Verify required fields are being sent (title, category, location, priority)
3. Check MongoDB Atlas → Network Access → IP Whitelist
4. Use MongoDB Compass to connect and view data directly

---

## 📚 API Endpoints Reference

### Base URL: `http://localhost:5001/api/issues`

| Method | Endpoint | Purpose | Request Body |
|--------|----------|---------|--------------|
| POST | `/` | Create new issue | `{ title, category, location, priority, description?, ... }` |
| GET | `/` | Get all issues | None |
| GET | `/:id` | Get single issue | None |
| PUT | `/:id` | Update issue | `{ field: newValue, ... }` |
| DELETE | `/:id` | Delete issue | None |

---

## 🎓 Next Steps

After successful setup, you can:

1. **View saved issues:**
   - Create a component to fetch and display all issues
   - Use `fetch('http://localhost:5001/api/issues')`

2. **Add image upload:**
   - Integrate Cloudinary or AWS S3
   - Update the image field to store URLs

3. **Add user authentication:**
   - Link issues to logged-in users
   - Add `userId` field to data model

4. **Deploy to production:**
   - Backend: Heroku, Railway, or Render
   - Frontend: Vercel or Netlify
   - Update API URL in frontend to production URL

---

## ✅ Success!

If you've completed all steps and can see:
- ✅ Backend server running
- ✅ MongoDB connected successfully  
- ✅ Form submission shows success message
- ✅ Data appears in MongoDB

**Congratulations! Your MongoDB integration is complete! 🎉**
