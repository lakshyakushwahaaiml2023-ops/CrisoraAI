import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { need } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const systemPrompt = `
      You are the "Nexus Oracle", an AI Disaster Management Controller.
      Analyze the incoming distress signal and provide a structured tactical assessment.
      
      Rules:
      1. Triage Score: 0-100 (100 is life-critical immediate death risk).
      2. Urgency: "critical", "high", "medium", or "low".
      3. Reasoning: One sentence explaining the tactical priority.
      4. Suggestion: One sentence on the best action/resource.
      
      Output ONLY valid JSON.
      JSON Format: { "triage_score": number, "urgency": "string", "reasoning": "string", "suggestion": "string" }
    `;

    const userPrompt = `
      Distress Signal: ${need.description}
      Type: ${need.need_type}
      People Affected: ${need.people_affected}
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(content);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ 
      triage_score: 50, 
      urgency: 'medium', 
      reasoning: 'AI Engine offline. Defaulting to manual triage.', 
      suggestion: 'Monitor manually.' 
    });
  }
}
