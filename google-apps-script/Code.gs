/**
 * ==============================================================================
 * Google Apps Script API: Google Drive Photo Gallery Backend
 * Author: Md. Nashid Mahim
 * Portfolio: https://github.com/mahim-13-08
 * ==============================================================================
 * 
 * Target Google Drive Folder:
 * URL: https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF
 * Folder ID: 1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF
 * 
 * ------------------------------------------------------------------------------
 * DEPLOYMENT INSTRUCTIONS (Quick 1-Minute Setup):
 * ------------------------------------------------------------------------------
 * 1. Open Google Apps Script:
 *    Visit https://script.google.com/home/start and click "+ New project".
 * 
 * 2. Paste this code:
 *    Delete any code in the editor and paste the entire contents of this file.
 *    Name the project (e.g., "Nashid Portfolio Photo API").
 * 
 * 3. Ensure Google Drive Folder is Publicly Accessible:
 *    - Open your Google Drive folder:
 *      https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF
 *    - Click "Share" (top-right).
 *    - Under "General access", select "Anyone with the link".
 *    - Set role to "Viewer".
 *    - Click "Done".
 * 
 * 4. Deploy as a Web App:
 *    - In the Apps Script editor, click the blue "Deploy" button (top right) > "New deployment".
 *    - Click the gear icon next to "Select type" and choose "Web app".
 *    - Configuration settings:
 *        * Description: "Nashid Portfolio Photography Gallery API"
 *        * Execute as: "Me (your-email@gmail.com)"
 *        * Who has access: "Anyone"  <-- CRITICAL: Allows portfolio visitors to fetch photos without login.
 *    - Click "Deploy".
 *    - Click "Authorize access" and grant Google Drive read permissions for your script.
 * 
 * 5. Connect to your Portfolio:
 *    - Copy the generated "Web App URL" (ends with `/exec`).
 *    - Paste it in `js/main.js` inside `PHOTOGRAPHY_CONFIG.appsScriptUrl`,
 *      OR paste it directly into the "Apps Script Setup" modal on your portfolio website!
 * ==============================================================================
 */

// Default Google Drive Folder ID
var DEFAULT_FOLDER_ID = "1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF";

/**
 * HTTP GET Request Handler
 * Responds with JSON containing metadata and image URLs for all photos in the folder.
 */
function doGet(e) {
  var folderId = DEFAULT_FOLDER_ID;

  // Support optional folderId query parameter (?folderId=...)
  if (e && e.parameter && e.parameter.folderId) {
    folderId = e.parameter.folderId;
  }

  try {
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    var photos = [];

    // Allowed image MIME types
    var imageMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/heic",
      "image/heif"
    ];

    while (files.hasNext()) {
      var file = files.next();
      var mimeType = file.getMimeType().toLowerCase();

      // Filter only image files
      var isImage = imageMimeTypes.indexOf(mimeType) !== -1 || mimeType.indexOf("image/") === 0;
      if (isImage) {
        var id = file.getId();
        var rawName = file.getName();
        // Clean title: remove file extension and clean up underscores/hyphens
        var cleanTitle = rawName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");

        var dateCreated = file.getDateCreated();
        var sizeBytes = file.getSize();

        photos.push({
          id: id,
          title: cleanTitle,
          fileName: rawName,
          description: file.getDescription() || "",
          mimeType: mimeType,
          date: Utilities.formatDate(dateCreated, Session.getScriptTimeZone(), "yyyy-MM-dd"),
          sizeFormatted: formatBytes(sizeBytes),
          // High-performance direct CDN thumbnail & preview URLs
          thumbnailUrl: "https://drive.google.com/thumbnail?id=" + id + "&sz=w600",
          previewUrl: "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600",
          directUrl: "https://lh3.googleusercontent.com/d/" + id,
          driveViewUrl: "https://drive.google.com/file/d/" + id + "/view?usp=sharing"
        });
      }
    }

    // Sort newest files first
    photos.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    var responseData = {
      status: "success",
      folderId: folderId,
      folderName: folder.getName(),
      totalPhotos: photos.length,
      photos: photos,
      timestamp: new Date().toISOString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    var errorResponse = {
      status: "error",
      message: error.toString(),
      folderId: folderId,
      timestamp: new Date().toISOString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Format bytes into human-readable format
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i < 0) i = 0;
  if (i >= sizes.length) i = sizes.length - 1;
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
