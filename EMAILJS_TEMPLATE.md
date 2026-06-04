# EmailJS Template

Use this in the EmailJS dashboard for the contact form.

## Subject

New portfolio message from {{from_name}}

## Plain Text Body

You received a new message from your portfolio website.

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

Reply-to: {{reply_to}}

## HTML Body

```html
<div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
<h2 style="margin: 0 0 12px;">New portfolio message</h2>
<p><strong>Name:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Message:</strong></p>
<div style="padding: 12px; background: #f3f4f6; border-radius: 8px; white-space: pre-wrap;">{{message}}</div>
<p style="margin-top: 12px;"><strong>Reply to:</strong> {{reply_to}}</p>
</div>
```

## Fields Used by the Form

- `from_name`
- `from_email`
- `message`
- `reply_to`

## Current IDs in the Site

- Service ID: `service_qzm4b85`
- Template ID: `template_p8ivg4k`
- Public Key: `U_ocY0NHNPqX9QOvW`