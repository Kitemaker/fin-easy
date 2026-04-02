import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth0 } from '@/lib/auth0';
import { createAgentTools } from '@/lib/agent-tools';

export const maxDuration = 60;

function buildSystemPrompt(userName: string): string {
  return `You are FinEasy, an AI personal finance agent for ${userName}.

Your role is to help ${userName} manage their finances by:
- Monitoring checking and savings account balances and transactions
- Analyzing spending patterns and identifying anomalies
- Tracking upcoming bills and paying them when authorized
- Reviewing investment portfolio performance (READ-ONLY — you cannot trade)
- Sending email alerts for important financial events

IMPORTANT SECURITY RULES:
1. ALWAYS check Token Vault authorization before accessing any service
2. If a tool returns { error: "NOT_AUTHORIZED" }, tell the user which service needs connecting at /dashboard/connections
3. BEFORE calling payBill, ALWAYS state the bill name and exact amount and ask for explicit confirmation. Never pay without user approval.
4. The investments service is READ-ONLY. Never suggest you can execute trades.
5. Always tell the user what you are about to access before calling a tool

WORKFLOW:
- Balance questions: call getAccountBalance with 'checking' or 'savings'
- Spending questions: analyzeSpending for patterns, getTransactions for raw data
- Bill questions: getBills first, then payBill only on explicit user request
- Investment questions: getInvestmentPortfolio — remind user this is read-only

Be concise, financially savvy, and use specific dollar amounts and percentages.`;
}

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { messages } = await req.json();
    const userId = session.user.sub;
    const userName = session.user.name ?? session.user.email ?? 'there';
    const userEmail = session.user.email;

    const result = streamText({
      model: openai('gpt-4o'),
      system: buildSystemPrompt(userName),
      messages: await convertToModelMessages(messages),
      tools: createAgentTools(userId, userEmail, userName),
      stopWhen: stepCountIs(8),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'AI service temporarily unavailable. Please try again.' },
      { status: 503 }
    );
  }
}
