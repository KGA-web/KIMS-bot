/**
 * KIMS Lead Capture - Google Apps Script
 * Version: 2.5 (Mirror Optimized)
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheet.new).
 * 2. Extensions -> App Script.
 * 3. Paste this code.
 * 4. Replace SPREADSHEET_URL with your sheet's URL.
 * 5. Deploy -> New Deployment -> Web App.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and paste it as SHEETS_URL in widget.js.
 */

function doPost(e) {
  try {
    // Current Sheet URL from your repo
    var SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1asCcwfMKesqPHcjtq_5TI8Vi19Blx2WGOmYdpVq1tXc/edit";
    var sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getSheets()[0];
    
    var data = JSON.parse(e.postData.contents);
    
    // Header Structure mirroring KGI standards: 
    // Timestamp | Name | Type | Phone | Course | Source | Metadata
    sheet.appendRow([
      new Date(), 
      data.name, 
      data.type || "Student",
      data.phone, 
      data.course, 
      data.inquiry || "n/a",
      data.source || "KAIA AI Bot",
      data.timestamp || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status":"success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error", 
      "message": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("KAIA API is active and ready for leads.");
}
