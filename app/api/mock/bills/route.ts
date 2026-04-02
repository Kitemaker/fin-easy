import { getBills, payBill, validateToken, validateWriteToken } from '@/lib/services/mock-data';

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!validateToken(token)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json({ bills: getBills() });
}

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!validateWriteToken(token))
    return Response.json(
      { error: 'INSUFFICIENT_SCOPE', message: 'Write scope required to pay bills' },
      { status: 401 }
    );
  const { billId } = await req.json();
  const result = payBill(billId);
  return Response.json({ result, success: true });
}
