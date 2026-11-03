
function renderEmailTemplate(data) {
  // Load the HTML template
  const template = HtmlService.createTemplateFromFile(
    "EmailTemplate"
  );

  // Pass dynamic information into the template
  template.roundNumber = data.roundNumber;
  template.country = data.country;
  template.grandPrix = data.grandPrix;
  template.sessionName = data.sessionName;
  template.date = data.date;
  template.startTime = data.startTime;
  template.countdown = data.countdown;
  template.circuit = data.circuit;

  // Generate the final HTML
  const htmlBody = template.evaluate().getContent();

  Logger.log("Email HTML template generated successfully.");

  return htmlBody;
}


function sendEmail(subject, htmlBody) {
  const properties = PropertiesService.getScriptProperties();

  const receiverEmail = properties.getProperty("RECEIVER_EMAIL");

  if (!receiverEmail) {
    throw new Error(
      "RECEIVER_EMAIL is missing from Script Properties."
    );
  }

  if (!subject || !htmlBody) {
    throw new Error(
      "Email subject and HTML body are required."
    );
  }

  // Check the remaining daily email quota.
  const remainingQuota = MailApp.getRemainingDailyQuota();

  if (remainingQuota < 1) {
    throw new Error("Daily email sending quota exhausted.");
  }

  MailApp.sendEmail({
    to: receiverEmail,
    subject: subject,
    htmlBody: htmlBody,
    name: "F1 Session Reminder"
  });

  Logger.log("Email sent successfully to: " + receiverEmail);
}
