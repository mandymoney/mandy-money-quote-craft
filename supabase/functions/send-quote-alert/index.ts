
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { quoteData } = await req.json()
    
    const emailBody = `
      <h2>New Quote Attempt</h2>
      <p><strong>Type:</strong> ${quoteData.attempt_type}</p>
      <p><strong>School:</strong> ${quoteData.school_name || 'Not provided'}</p>
      <p><strong>Coordinator:</strong> ${quoteData.coordinator_name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${quoteData.coordinator_email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${quoteData.contact_phone || 'Not provided'}</p>
      <p><strong>Teachers:</strong> ${quoteData.teacher_count}</p>
      <p><strong>Students:</strong> ${quoteData.student_count}</p>
      <p><strong>Total Price:</strong> $${quoteData.total_price}</p>
      <p><strong>Program Start:</strong> ${quoteData.program_start_date || 'Not provided'}</p>
      ${quoteData.pdf_url ? `<p><strong>PDF:</strong> <a href="${quoteData.pdf_url}">View Quote/Order</a></p>` : ''}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mandy Money Alerts <alerts@mandymoney.com.au>',
        to: ['hello@mandymoney.com.au'],
        subject: `New ${quoteData.attempt_type} attempt - ${quoteData.school_name || 'Unknown School'}`,
        html: emailBody,
      }),
    })

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      throw new Error(`Email API error: ${res.status}`)
    }
  } catch (error) {
    console.error('Error sending alert email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
