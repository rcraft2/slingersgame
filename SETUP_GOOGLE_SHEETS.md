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
    
    // Send welcome email to subscriber
    MailApp.sendEmail({
      to: data.email,
      subject: 'Welcome to the Slingers Posse!',
      name: 'Slingers Game', // Custom sender name (shows as "Slingers Game" instead of your Gmail name)
      replyTo: 'your-email@example.com', // Optional: where replies should go
      htmlBody: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f4c542;">Howdy, ${data.name}!</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Thanks for joining the Slingers Posse! You're now part of an exclusive group that will get:
          </p>
          <ul style="font-size: 16px; line-height: 1.8;">
            <li>🎴 Exclusive card reveals</li>
            <li>🤠 Slinger spotlights</li>
            <li>⭐ Early access news</li>
          </ul>
          <p style="font-size: 16px; line-height: 1.6;">
            Keep an eye on your inbox for updates about Slingers!
          </p>
          <p style="font-size: 16px; color: #8b4513;">
            — The Slingers Team<br>
            <em>Slingin' Cards, Buildin' Hands, and Takin' Names</em>
          </p>
        </div>
      `
    });
    
    // Optional: Send notification to yourself
    MailApp.sendEmail({
      to: 'your-email@example.com', // Replace with your email
      subject: 'New Slingers Posse Signup!',
      body: 'Name: ' + data.name + '\nEmail: ' + data.email + '\nTimestamp: ' + data.timestamp
    });
    
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
5. **You WILL be prompted to authorize the script:**
   - Click **Authorize access**
   - Choose your Google account
   - You'll see a warning: "Google hasn't verified this app"
   - Click **Advanced** → **Go to [project name] (unsafe)** (this is safe - it's your own script!)
   - **Review the permissions requested:**
     - "Send email as you" - Required for welcome emails
     - "See, edit, create, and delete your spreadsheets" - Required to save form data
   - Click **Allow**
6. **Copy the Web app URL** (it looks like: `https://script.google.com/macros/s/...../exec`)

**Important:** The authorization step is crucial! Without it, emails won't send. The warning appears because it's a custom script, but it's completely safe since you wrote it.

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
- **Emails not sending**: Make sure you've authorized the script to send emails on your behalf when you first run it
- **Want to customize the welcome email**: Edit the `htmlBody` section in the script above to match your brand

## Setting Up Automated Emails

The script above automatically sends:
1. **Welcome email to new subscribers** - Personalized with their name
2. **Notification to you** - So you know when someone signs up (optional)

**To customize:**
- **Sender Name**: Change `name: 'Slingers Game'` to whatever you want to appear as the sender
- **Reply-To Address**: Set `replyTo: 'your-email@example.com'` so replies go to your preferred email
- **Email Address**: The email will come from your Google account, but the display name can be customized
- **Email Content**: Modify the `htmlBody` section to match your brand
- Remove the notification email block if you don't want personal alerts

**Email limits:**
- Free Gmail accounts: ~100 emails per day
- Google Workspace accounts: ~1,500 emails per day

**Note:** The actual email address will be from your Google account (e.g., yourname@gmail.com), but recipients will see the custom name you set. If you need a fully custom email address (like info@slingers.com), you'll need to use a third-party email service like SendGrid, Mailgun, or set up SMTP forwarding through Google Workspace.

## Privacy Note

Make sure to add a privacy policy to your website mentioning that you collect email addresses for newsletter purposes.
