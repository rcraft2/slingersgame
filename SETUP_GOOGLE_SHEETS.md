# Google Sheets Form Setup Guide

Follow these steps to connect your form to Google Sheets:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Slingers Posse Signups" (or whatever you prefer)
4. In the first row, add these headers:
   - Column A: `Timestamp`
   - Column B: `Name`
   - Column C: `Email`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any code in the editor
3. Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Append the data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'data': data
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (disk icon) and name your project (e.g., "Slingers Form Handler")

## Step 3: Deploy the Script

1. Click the **Deploy** button → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" → Choose **Web app**
3. Configure the deployment:
   - **Description**: "Form submission handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [project name] (unsafe)**
   - Click **Allow**
6. **Copy the Web app URL** (it looks like: `https://script.google.com/macros/s/...../exec`)

## Step 4: Update Your Website

1. Open `script.js`
2. Find this line:
   ```javascript
   const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with your Web app URL from Step 3

Example:
```javascript
const scriptURL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

4. Save the file
5. Commit and push to GitHub

## Step 5: Test It!

1. Visit your website
2. Fill out the form and submit
3. Check your Google Sheet - you should see the new entry!

## Exporting to CSV

To download your data as CSV:
1. Open your Google Sheet
2. Click **File** → **Download** → **Comma Separated Values (.csv)**

## Troubleshooting

- **Form submits but no data appears**: Check that the Apps Script is deployed with "Who has access" set to "Anyone"
- **Need to update the script**: After making changes, click **Deploy** → **Manage deployments** → Edit (pencil icon) → **Version: New version** → **Deploy**
- **Want email notifications**: Add this to your Apps Script after `sheet.appendRow([...]);`:

```javascript
// Send email notification
MailApp.sendEmail({
  to: 'your-email@example.com',
  subject: 'New Posse Signup!',
  body: 'Name: ' + data.name + '\nEmail: ' + data.email
});
```

## Privacy Note

Make sure to add a privacy policy to your website mentioning that you collect email addresses for newsletter purposes.
