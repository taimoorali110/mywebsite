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
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
  <h2 style="margin: 0 0 12px;">New message from your portfolio website</h2>
  <p><strong>Name:</strong> {{from_name}}</p>
  <p><strong>Email:</strong> {{from_email}}</p>
  <p><strong>Message:</strong></p>
  <div style="white-space: pre-wrap; padding: 12px; background: #f3f4f6; border-radius: 8px;">{{message}}</div>
  <p style="margin-top: 12px;"><strong>Reply to:</strong> {{reply_to}}</p>
  <p><strong>Destination:</strong> {{to_email}}</p>
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