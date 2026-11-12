# Our Little Date Planner

## Files
- `index.html`: website (frontend)
- `google-apps-script.gs`: email receiver and email template

## Setup email (yes, this part must be updated)
1. Open https://script.google.com/ and create a new Apps Script project.
2. Paste the contents of `google-apps-script.gs`.
3. Replace `YOUR_EMAIL@example.com` in `EMAIL_TO` with the inbox that should receive the date request.
4. Click **Deploy > New deployment > Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone**, then deploy and authorize the script.
6. Copy the Web app URL ending in `/exec`.
7. In `index.html`, replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` in `APPS_SCRIPT_URL` with that URL.
8. Upload `index.html` to GitHub Pages (or another static host).

## Email contents
The email includes:
- selected pre-dinner activity (Mini Golf / Arkády / Cinema / Sunset / Shopping together)
- selected restaurant (Matzip / Numaru / Gangnam / Dokao)
- date and start time
- optional note

## Important
- The email recipient is configured in Apps Script, not in the public website.
- The Apps Script endpoint is public so the website can submit requests. The script validates the allowed choices and limits free-text length.
- The browser uses `no-cors`, so it cannot read Google's response. The page can confirm that the request was submitted to the endpoint, but it cannot independently verify final email delivery. Check the Apps Script execution log and inbox/spam during testing.
- Do not publish the Apps Script source with private credentials. The recipient address is configured server-side.
