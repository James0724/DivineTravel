import { NextRequest, NextResponse } from 'next/server'
import { ContactSchema } from '@/lib/validations/booking'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const result = ContactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 422 }
      )
    }

    // TODO: integrate with email service (Resend, SendGrid, Nodemailer)
    // For now, log the contact submission
    console.log('[Contact Form Submission]', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      timestamp: new Date().toISOString(),
    })

    // In production, you'd send an email here:
    // await sendEmail({
    //   to: 'hello@acaciasafaris.com',
    //   subject: `New enquiry: ${body.subject}`,
    //   html: `<p>From: ${body.name} (${body.email})</p><p>${body.message}</p>`,
    // })

    return NextResponse.json({ success: true, message: 'Message received' })
  } catch (error) {
    console.error('[POST /api/contact]', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
