function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1asCcwfMKesqPHcjtq_5TI8Vi19Blx2WGOmYdpVq1tXc/edit").getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(), 
      data.name, 
      data.phone, 
      data.course, 
      "AI Bot Lead"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status":"success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({"status":"error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
