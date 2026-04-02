import { Resend } from 'resend';
import type { Bill } from '@/types';

export async function sendSpendingAlert(
  toEmail: string,
  userName: string,
  subject: string,
  body: string
): Promise<{ success: boolean; messageId?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: true, messageId: `demo_${Date.now()}` };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: 'FinEasy <onboarding@resend.dev>',
      to: toEmail,
      subject,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#1e3a5f;">FinEasy Alert</h2><p>Hi ${userName},</p><div>${body}</div><p style="color:#6b7280;font-size:14px;margin-top:24px;">Sent by FinEasy on your behalf using your authorized email connection.</p></div>`,
    });
    if (error) return { success: false };
    return { success: true, messageId: data?.id };
  } catch {
    return { success: false };
  }
}

export async function sendBillPaymentConfirmation(
  toEmail: string,
  userName: string,
  bill: Bill,
  confirmationNumber: string
): Promise<{ success: boolean; messageId?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: true, messageId: `demo_${Date.now()}` };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: 'FinEasy <onboarding@resend.dev>',
      to: toEmail,
      subject: `Bill Payment Confirmed: ${bill.name}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#1e3a5f;">Bill Payment Confirmed ✓</h2><p>Hi ${userName},</p><p>Your bill payment has been processed:</p><table style="border-collapse:collapse;width:100%;"><tr><td style="padding:8px;font-weight:bold;">Bill</td><td style="padding:8px;">${bill.name}</td></tr><tr style="background:#f0fdf4;"><td style="padding:8px;font-weight:bold;">Amount</td><td style="padding:8px;">$${bill.amount.toFixed(2)}</td></tr><tr><td style="padding:8px;font-weight:bold;">Confirmation</td><td style="padding:8px;">${confirmationNumber}</td></tr></table><p style="color:#6b7280;font-size:14px;margin-top:24px;">Sent by FinEasy using your authorized bill payment connection.</p></div>`,
    });
    if (error) return { success: false };
    return { success: true, messageId: data?.id };
  } catch {
    return { success: false };
  }
}
