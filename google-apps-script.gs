/**
 * Our Little Date — Google Apps Script
 * 1) Replace EMAIL_TO with the email address that should receive date requests.
 * 2) Deploy > New deployment > Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 3) Copy the deployed URL ending in /exec into APPS_SCRIPT_URL in index.html.
 */
const EMAIL_TO = "YOUR_EMAIL@example.com";

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) throw new Error("Empty request");
    const data = JSON.parse(raw);

    const activity = clean(data.activity, 100);
    const restaurant = clean(data.restaurant, 100);
    const date = clean(data.date, 30);
    const time = clean(data.time, 20);
    const note = clean(data.note || "", 1000);

    const allowedActivities = ["Mini Golf", "Arkády", "Cinema", "Sunset", "Shopping together"];
    const allowedRestaurants = ["Matzip", "Numaru", "Gangnam", "Dokao"];
    if (!allowedActivities.includes(activity)) throw new Error("Invalid activity");
    if (!allowedRestaurants.includes(restaurant)) throw new Error("Invalid restaurant");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Invalid date");
    if (!/^\d{2}:\d{2}$/.test(time)) throw new Error("Invalid time");
    if (EMAIL_TO.indexOf("@") < 1 || EMAIL_TO.includes("YOUR_EMAIL")) throw new Error("Set EMAIL_TO first");

    const prettyDate = Utilities.formatDate(new Date(date + "T12:00:00"), Session.getScriptTimeZone(), "dd/MM/yyyy");
    const subject = "💗 Date request mới: " + activity + " + " + restaurant;
    const plain = [
      "Có một date request mới!",
      "",
      "Hoạt động trước khi ăn: " + activity,
      "Nhà hàng: " + restaurant,
      "Ngày: " + prettyDate,
      "Giờ bắt đầu: " + time,
      "Lời nhắn: " + (note || "(Không có)"),
      "",
      "Sent from Our Little Date Planner ♡"
    ].join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#49343c;background:#fff8fa;border-radius:18px">
        <h2 style="color:#bd6684">💗 Our Little Date</h2>
        <p>Em vừa chọn một buổi date cho hai người!</p>
        <div style="background:white;border:1px solid #f2dce4;border-radius:14px;padding:18px;line-height:1.9">
          <b>Hoạt động:</b> ${escapeHtml(activity)}<br>
          <b>Nhà hàng:</b> ${escapeHtml(restaurant)}<br>
          <b>Ngày:</b> ${escapeHtml(prettyDate)}<br>
          <b>Giờ:</b> ${escapeHtml(time)}<br>
          <b>Lời nhắn:</b> ${escapeHtml(note || "(Không có)")}
        </div>
        <p style="color:#b96c88">Made with love, just for you ♡</p>
      </div>`;
    MailApp.sendEmail({to: EMAIL_TO, subject: subject, body: plain, htmlBody: html, name: "Our Little Date"});
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function clean(value, maxLength) {
  return String(value == null ? "" : value).replace(/[<>]/g, "").trim().slice(0, maxLength);
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
