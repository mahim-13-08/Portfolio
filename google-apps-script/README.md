# Google Apps Script Drive Photo Gallery Integration

This folder contains the complete Google Apps Script code to serve photos from your Google Drive folder directly to your portfolio without requiring Google Cloud API keys or authentication prompts.

## Folder Details
- **Google Drive Folder**: [View Folder](https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF)
- **Folder ID**: `1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF`

---

## 🚀 3-Minute Deployment Steps

### Step 1: Set Google Drive Folder Permission to Public Viewer
1. Open your folder: [Google Drive Folder](https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF)
2. Click the folder name dropdown or the **Share** button (top right).
3. Under **General access**, change from **Restricted** to **Anyone with the link**.
4. Set role to **Viewer**.
5. Click **Done**.

### Step 2: Create Google Apps Script Project
1. Open [Google Apps Script Editor](https://script.google.com/home/start).
2. Click **+ New project**.
3. Rename the project to `Nashid Portfolio Photos API`.
4. Delete any code in the editor (`function myFunction() {...}`).
5. Copy all the code from [`Code.gs`](./Code.gs) and paste it into the editor.
6. Click the **Save** icon (disk) or press `Ctrl + S`.

### Step 3: Deploy as Web App
1. Click the blue **Deploy** button in the top right, then select **New deployment**.
2. Click the gear icon (⚙️) beside *Select type* and choose **Web app**.
3. Configure the following:
   - **Description**: `Portfolio Photos API`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(Must be Anyone so visitors can see the photos without logging into Google)*
4. Click **Deploy**.
5. Click **Authorize access** when prompted, choose your Google account, click **Advanced** > **Go to Nashid Portfolio Photos API (unsafe)**, and click **Allow**.
6. Copy the **Web App URL** (e.g., `https://script.google.com/macros/s/AKfycbx.../exec`).

### Step 4: Link to Portfolio
Open `js/main.js` and paste your URL into the `PHOTOGRAPHY_CONFIG` object:
```javascript
const PHOTOGRAPHY_CONFIG = {
  folderId: "1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF",
  appsScriptUrl: "https://script.google.com/macros/s/YOUR_DEPLOYED_ID/exec",
  // ...
};
```
*(Alternatively, you can click the **⚙️ Apps Script Setup** button inside the Photography section on your portfolio to test and save the URL directly from the live browser!)*

---

## 📡 API Response Format

```json
{
  "status": "success",
  "folderId": "1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF",
  "folderName": "Photos",
  "totalPhotos": 12,
  "photos": [
    {
      "id": "1abc...",
      "title": "Campus Arch",
      "fileName": "Campus Arch.jpg",
      "description": "",
      "mimeType": "image/jpeg",
      "date": "2026-10-10",
      "sizeFormatted": "1.7 MB",
      "thumbnailUrl": "https://drive.google.com/thumbnail?id=1abc...&sz=w600",
      "previewUrl": "https://drive.google.com/thumbnail?id=1abc...&sz=w1600",
      "directUrl": "https://lh3.googleusercontent.com/d/1abc...",
      "driveViewUrl": "https://drive.google.com/file/d/1abc.../view?usp=sharing"
    }
  ]
}
```
