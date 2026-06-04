# EmailJS Template

Use this template in the EmailJS dashboard for the contact form.

## Subject

Portfolio contact from {{from_name}}

## Message Body

New message from your portfolio website

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

Reply to: {{reply_to}}

Destination: {{to_email}}

## HTML Version

```html
<div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
      <div style="padding:24px 28px;background:linear-gradient(135deg,#f8fafc,#eef2ff);border-bottom:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">Portfolio contact</p>
        <h2 style="margin:0;font-size:22px;line-height:1.3;color:#0f172a;">New message from {{from_name}}</h2>
      </div>

      <div style="padding:28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:0 0 14px;font-size:14px;color:#475569;"><strong style="color:#0f172a;">Name:</strong> {{from_name}}</td>
          </tr>
          <tr>
            <td style="padding:0 0 14px;font-size:14px;color:#475569;"><strong style="color:#0f172a;">Email:</strong> <a href="mailto:{{from_email}}" style="color:#2563eb;text-decoration:none;">{{from_email}}</a></td>
          </tr>
          <tr>
            <td style="padding:0 0 14px;font-size:14px;color:#475569;"><strong style="color:#0f172a;">Reply to:</strong> {{reply_to}}</td>
          </tr>
          <tr>
            <td style="padding:0 0 18px;font-size:14px;color:#475569;"><strong style="color:#0f172a;">Destination:</strong> {{to_email}}</td>
          </tr>
        </table>

        <div style="margin-top:6px;padding:18px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
          <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#0f172a;">Message</p>
          <div style="white-space:pre-wrap;font-size:14px;line-height:1.7;color:#1e293b;">{{message}}</div>
        </div>
      </div>

      <div style="padding:18px 28px;border-top:1px solid #e2e8f0;background:#ffffff;">
        <p style="margin:0;font-size:12px;color:#64748b;">Sent from your portfolio contact form</p>
      </div>
    </div>
  </div>
</div>
```

## Template Variables

- `from_name`
- `from_email`
- `message`
- `reply_to`
- `to_email`

## Current Form Values

- Service ID: `service_qzm4b85`
- Template ID: `template_p8ivg4k`
- Public Key: `U_ocY0NHNPqX9QOvW`