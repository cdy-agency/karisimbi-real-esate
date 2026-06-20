// src/lib/email-templates.ts

/* ─────────────────────────────────────────────
   SHARED STYLES (inlined — email clients need this)
   ───────────────────────────────────────────── */

const BASE = {
  brand: "#7A2240",
  brandLight: "#9B2D52",
  brandBg: "#FDF4F7",
  gold: "#C9A96E",
  dark: "#1A1A2E",
  gray: "#6B7280",
  grayLight: "#F9FAFB",
  border: "#E5E7EB",
  white: "#FFFFFF",
  success: "#059669",
  successBg: "#ECFDF5",
};

function badge(text: string, color = BASE.brand) {
  return `<span style="display:inline-block;background:${color}1A;color:${color};
    font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
    padding:3px 10px;border-radius:20px;border:1px solid ${color}33;">${text}</span>`;
}

function row(label: string, value: string | undefined | null, highlight = false) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 16px;font-size:12px;font-weight:600;text-transform:uppercase;
        letter-spacing:0.08em;color:${BASE.gray};width:40%;border-bottom:1px solid ${BASE.border};
        background:${highlight ? BASE.brandBg : BASE.grayLight};">${label}</td>
      <td style="padding:10px 16px;font-size:14px;color:${BASE.dark};font-weight:500;
        border-bottom:1px solid ${BASE.border};background:${highlight ? BASE.brandBg : BASE.white};">${value}</td>
    </tr>`;
}

function section(title: string, rows: string) {
  return `
    <div style="margin-bottom:28px;">
      <div style="margin-bottom:14px;">
        <h3 style="margin:0;font-size:15px;font-weight:700;color:${BASE.dark};letter-spacing:-0.01em;">
          ${title}
        </h3>
      </div>

      <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;
        border:1px solid ${BASE.border};box-shadow:0 1px 4px rgba(0,0,0,0.05);">
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* Wrapper WITH footer — used by sell property & book visit emails */
function wrapper(preheader: string, content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Karisimbi Real Estate</title>
</head>

<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;min-height:100vh;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${BASE.brand};border-radius:16px 16px 0 0;padding:0;overflow:hidden;">
              <div style="padding:32px 36px 28px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;
                  text-transform:uppercase;color:rgba(255,255,255,0.55);">
                  Karisimbi Real Estate
                </p>

                <div style="width:40px;height:2px;background:${BASE.gold};
                  margin-bottom:16px;border-radius:2px;"></div>
              </div>

              <!-- Gold accent -->
              <div style="height:4px;background:linear-gradient(90deg,${BASE.gold},${BASE.brandLight},${BASE.gold});"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:${BASE.white};padding:36px;
              border-left:1px solid ${BASE.border};
              border-right:1px solid ${BASE.border};">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${BASE.dark};border-radius:0 0 16px 16px;padding:24px 36px;">

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:${BASE.white};">
                      Karisimbi Real Estate
                    </p>

                    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45);">
                      Kigali, Rwanda
                    </p>
                  </td>

                  <td align="right">
                    <a href="tel:+250787861400"
                      style="color:${BASE.gold};font-size:12px;text-decoration:none;font-weight:600;">
                      +250 787 861 400
                    </a>
                    <br/>

                    <a href="mailto:info@karisimbirealestate.com"
                      style="color:rgba(255,255,255,0.45);font-size:11px;text-decoration:none;">
                      info@karisimbirealestate.com
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin-top:16px;padding-top:16px;
                border-top:1px solid rgba(255,255,255,0.1);">
                <p style="margin:0;font-size:11px;
                  color:rgba(255,255,255,0.3);text-align:center;">
                  This is an automated notification. Please do not reply to this email.
                </p>
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/* Wrapper WITHOUT footer — used by reset password email only */
function wrapperNoFooter(preheader: string, content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Karisimbi Real Estate</title>
</head>

<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;min-height:100vh;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${BASE.brand};border-radius:16px 16px 0 0;padding:0;overflow:hidden;">
              <div style="padding:32px 36px 28px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;
                  text-transform:uppercase;color:rgba(255,255,255,0.55);">
                  Karisimbi Real Estate
                </p>

                <div style="width:40px;height:2px;background:${BASE.gold};
                  margin-bottom:16px;border-radius:2px;"></div>
              </div>

              <!-- Gold accent -->
              <div style="height:4px;background:linear-gradient(90deg,${BASE.gold},${BASE.brandLight},${BASE.gold});"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:${BASE.white};padding:36px;
              border-left:1px solid ${BASE.border};
              border-right:1px solid ${BASE.border};
              border-bottom:1px solid ${BASE.border};
              border-radius:0 0 16px 16px;">
              ${content}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/* ─────────────────────────────────────────────
   SELL PROPERTY EMAIL
   ───────────────────────────────────────────── */

export interface SellPropertyData {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  idNumber?: string;
  propertyType?: string;
  location?: string;
  propertySize?: string;
  askingPrice?: string;
  documentsAvailable?: string;
  hasIssues?: string;
  issuesExplanation?: string;
}

export function sellPropertyEmailHtml(data: SellPropertyData): string {
  const docsLabel =
    data.documentsAvailable === "yes" ? "All Ready" :
    data.documentsAvailable === "no"  ? "Some Missing" : undefined;

  const issuesLabel =
    data.hasIssues === "yes" ? "Yes" :
    data.hasIssues === "no"  ? "None" : undefined;

  const ownerRows =
    row("Full Name", data.fullName, true) +
    row("Phone", data.phone) +
    row("Email", data.email, true) +
    row("Residential Address", data.address) +
    row("ID / Passport No", data.idNumber, true);

  const propertyRows =
    row("Property Type", data.propertyType, true) +
    row("Location", data.location) +
    row("Size", data.propertySize, true) +
    row("Asking Price (RWF)", data.askingPrice ? `RWF ${data.askingPrice}` : undefined) +
    row("Documents Available", docsLabel, true);

  const issueRows =
    row("Has Issues", issuesLabel, data.hasIssues === "yes") +
    (data.hasIssues === "yes" && data.issuesExplanation
      ? row("Issue Details", data.issuesExplanation)
      : "");

  const content = `
    <!-- Title -->
    <div style="margin-bottom:28px;">
      <div style="margin-bottom:12px;">
        ${badge("New Submission")}
        &nbsp;
        ${badge("Sell Property", BASE.gold)}
      </div>

      <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;
        color:${BASE.dark};letter-spacing:-0.02em;">
        New Property Listing Request
      </h1>

      <p style="margin:0;font-size:14px;color:${BASE.gray};line-height:1.6;">
        A new property has been submitted for listing review.
        Please contact the owner within <strong>24 hours</strong>.
      </p>
    </div>

    <!-- Divider -->
    <div style="height:1px;
      background:linear-gradient(90deg,${BASE.brand}33,transparent);
      margin-bottom:28px;"></div>

    ${section("Owner Information", ownerRows)}
    ${section("Property Details", propertyRows)}
    ${issueRows ? section("Issues & Disclosures", issueRows) : ""}

    <!-- CTA -->
    <div style="margin-top:8px;padding:20px;background:${BASE.brandBg};
      border-radius:12px;border-left:4px solid ${BASE.brand};text-align:center;">

      <p style="margin:0 0 12px;font-size:13px;color:${BASE.gray};">
        Ready to follow up with this client?
      </p>

      <a href="mailto:${data.email}"
        style="display:inline-block;background:${BASE.brand};
        color:${BASE.white};text-decoration:none;font-size:13px;
        font-weight:700;padding:10px 24px;border-radius:8px;
        letter-spacing:0.04em;">
        Reply to ${data.fullName}
      </a>

    </div>`;

  return wrapper(
    `New property listing request from ${data.fullName}`,
    content
  );
}

export function sellPropertyEmailText(data: SellPropertyData): string {
  return `
NEW PROPERTY LISTING REQUEST — Karisimbi Real Estate
=====================================================

OWNER INFORMATION
-----------------
Name:      ${data.fullName}
Phone:     ${data.phone}
Email:     ${data.email}
Address:   ${data.address ?? "—"}
ID / Passport: ${data.idNumber ?? "—"}

PROPERTY DETAILS
----------------
Type:      ${data.propertyType ?? "—"}
Location:  ${data.location ?? "—"}
Size:      ${data.propertySize ?? "—"}
Asking Price: RWF ${data.askingPrice ?? "—"}
Documents: ${data.documentsAvailable ?? "—"}

ISSUES
------
Has Issues: ${data.hasIssues ?? "—"}
${data.hasIssues === "yes" ? `Details: ${data.issuesExplanation}` : ""}

---
Karisimbi Real Estate · info@karisimbirealestate.com · +250 787 861 400
  `.trim();
}

/* ─────────────────────────────────────────────
   BOOK VISIT EMAIL
   ───────────────────────────────────────────── */

export interface BookVisitData {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  idNumber?: string;
  propertyType?: string;
  propertyLocation?: string;
  propertyPrice?: string;
  visitDate?: string;
  visitTime?: string;
  transportation?: string;
}

function formatDate(iso?: string) {
  if (!iso) return undefined;

  return new Date(iso).toLocaleDateString("en-RW", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTransport(val?: string) {
  if (val === "alone") return "Coming Alone";
  if (val === "with-driver") return "Coming with Own Driver";
  if (val === "need-transport") return "Needs Pickup Arranged";

  return val;
}

export function bookVisitEmailHtml(data: BookVisitData): string {
  const clientRows =
    row("Full Name", data.fullName, true) +
    row("Phone", data.phone) +
    row("Email", data.email, true) +
    row("Residential Address", data.address) +
    row("ID / Passport No", data.idNumber, true);

  const propertyRows =
    row("Property Type", data.propertyType, true) +
    row("Location", data.propertyLocation) +
    row(
      "Listed Price (RWF)",
      data.propertyPrice ? `RWF ${data.propertyPrice}` : undefined,
      true
    );

  const visitRows =
    row("Visit Date", formatDate(data.visitDate), true) +
    row("Visit Time", data.visitTime) +
    row("Transportation", formatTransport(data.transportation), true);

  const needsPickup = data.transportation === "need-transport";

  const content = `
    <!-- Title -->
    <div style="margin-bottom:28px;">

      <div style="margin-bottom:12px;">
        ${badge("New Booking")}
        &nbsp;
        ${badge("Property Visit", "#0369a1")}
        ${needsPickup ? `&nbsp; ${badge("Pickup Required", "#D97706")}` : ""}
      </div>

      <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;
        color:${BASE.dark};letter-spacing:-0.02em;">
        New Viewing Request
      </h1>

      <p style="margin:0;font-size:14px;color:${BASE.gray};line-height:1.6;">
        A client has requested a property viewing.
        Please confirm their slot and ${
          needsPickup
            ? "<strong>arrange transport pickup</strong>"
            : "assign an agent"
        }.
      </p>

    </div>

    <!-- Visit date box -->
    ${
      data.visitDate
        ? `
    <div style="margin-bottom:28px;padding:16px 20px;background:#EFF6FF;
      border-radius:12px;border:1px solid #BFDBFE;">

      <p style="margin:0;font-size:11px;font-weight:700;
        text-transform:uppercase;letter-spacing:0.1em;color:#3B82F6;">
        Requested Visit
      </p>

      <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:${BASE.dark};">
        ${formatDate(data.visitDate)}
        ${data.visitTime ? `at ${data.visitTime}` : ""}
      </p>

    </div>`
        : ""
    }

    <!-- Divider -->
    <div style="height:1px;
      background:linear-gradient(90deg,${BASE.brand}33,transparent);
      margin-bottom:28px;"></div>

    ${section("Client Information", clientRows)}
    ${section("Property to Visit", propertyRows)}
    ${section("Visit Schedule & Transport", visitRows)}

    <!-- CTA -->
    <div style="margin-top:8px;padding:20px;background:${BASE.brandBg};
      border-radius:12px;border-left:4px solid ${BASE.brand};text-align:center;">

      <p style="margin:0 0 12px;font-size:13px;color:${BASE.gray};">
        Confirm this booking by reaching out to the client directly.
      </p>

      ${
        data.email
          ? `
      <a href="mailto:${data.email}"
        style="display:inline-block;background:${BASE.brand};
        color:${BASE.white};text-decoration:none;font-size:13px;
        font-weight:700;padding:10px 24px;border-radius:8px;
        letter-spacing:0.04em;margin-right:8px;">
        Email ${data.fullName}
      </a>`
          : ""
      }

      <a href="tel:${data.phone}"
        style="display:inline-block;background:${BASE.dark};
        color:${BASE.white};text-decoration:none;font-size:13px;
        font-weight:700;padding:10px 24px;border-radius:8px;
        letter-spacing:0.04em;">
        Call ${data.phone}
      </a>

    </div>`;

  return wrapper(
    `New viewing request from ${data.fullName}`,
    content
  );
}

export function bookVisitEmailText(data: BookVisitData): string {
  return `
NEW PROPERTY VIEWING REQUEST — Karisimbi Real Estate
=====================================================

CLIENT INFORMATION
------------------
Name:      ${data.fullName}
Phone:     ${data.phone}
Email:     ${data.email ?? "—"}
Address:   ${data.address ?? "—"}
ID / Passport: ${data.idNumber ?? "—"}

PROPERTY
--------
Type:      ${data.propertyType ?? "—"}
Location:  ${data.propertyLocation ?? "—"}
Price:     RWF ${data.propertyPrice ?? "—"}

VISIT SCHEDULE
--------------
Date:      ${formatDate(data.visitDate) ?? "—"}
Time:      ${data.visitTime ?? "—"}
Transport: ${formatTransport(data.transportation) ?? "—"}

---
Karisimbi Real Estate · info@karisimbirealestate.com · +250 787 861 400
  `.trim();
}

export function resetPasswordEmailHtml(
  resetLink: string,
  recipientEmail: string
): string {
  const content = `
    <!-- Title -->
    <div style="margin-bottom:28px;">
      <div style="margin-bottom:12px;">
        ${badge("Security Notice")}
        &nbsp;
        ${badge("Password Reset", "#0369a1")}
      </div>

      <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;
        color:${BASE.dark};letter-spacing:-0.02em;">
        Reset Your Password
      </h1>

      <p style="margin:0;font-size:14px;color:${BASE.gray};line-height:1.6;">
        We received a request to reset the password for your account.
        Click the button below to choose a new password.
      </p>
    </div>

    <!-- Divider -->
    <div style="height:1px;
      background:linear-gradient(90deg,${BASE.brand}33,transparent);
      margin-bottom:28px;"></div>

    <!-- Account info table -->
    <div style="margin-bottom:28px;">
      <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;
        border:1px solid ${BASE.border};box-shadow:0 1px 4px rgba(0,0,0,0.05);">
        <tbody>
          ${row("Account Email", recipientEmail, true)}
          ${row("Link Expires In", "15 minutes")}
          ${row("Request Type", "Password Reset", true)}
        </tbody>
      </table>
    </div>

    <!-- CTA button -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${resetLink}"
        style="display:inline-block;background:${BASE.brand};
        color:${BASE.white};text-decoration:none;font-size:15px;
        font-weight:700;padding:14px 36px;border-radius:10px;
        letter-spacing:0.04em;">
        Reset My Password
      </a>

      <p style="margin:14px 0 4px;font-size:12px;color:${BASE.gray};">
        Button not working? Copy and paste this link into your browser:
      </p>

      <p style="margin:0;font-size:11px;color:${BASE.brand};word-break:break-all;">
        ${resetLink}
      </p>
    </div>`;

  return wrapperNoFooter(
    "Reset your Karisimbi Real Estate password — link expires in 15 minutes",
    content
  );
}

export function resetPasswordEmailText(resetLink: string): string {
  return `
RESET YOUR PASSWORD — Karisimbi Real Estate
============================================

We received a request to reset your password.

Click the link below (expires in 15 minutes):
${resetLink}
  `.trim();
}