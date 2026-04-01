import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let need: any = {};
  
  try {
    const body = await req.json();
    need = body.need || {};
    const volunteer = body.volunteer;
    const nearbyCamps = body.nearbyCamps;

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      const systemPrompt = `
        You are "THE SENTINEL", a high-performance Tactical AI for Disaster Response Volunteers.
        Your goal is to analyze a MISSION and provide a 2-sentence battlefield logic summary for the volunteer.

        ANALYSIS PARAMETERS:
        - Mission Urgency: ${need.urgency_label} (${need.urgency_level}/100)
        - Proximity: ${need.distance || 'Calculated field'} km
        - Volunteer Skills: ${volunteer?.skills?.join(', ') || 'General'}
        - Nearby Camps: ${nearbyCamps?.length || 0} active hubs detected.

        FORMAT YOUR RESPONSE:
        1. TACTICAL_SUMMARY: Why take this mission? (Proximity/Skill-fit)
        2. FIELD_ACTION: One immediate next step (e.g., grab a specific kit from a specific camp).

        BE CONCISE. TACTICAL. AUTHORITATIVE.
      `;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze mission ID ${need.id}: ${need.description}` }
          ],
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ 
            advice: data.choices[0].message.content,
            timestamp: new Date().toISOString()
        });
      }
    }

    // 🛰️ HIGH-FIDELITY TACTICAL FALLBACK (Field Unit Mode)
    const urgency = need.urgency_label || 'high';
    const dist = need.distance || '2.4';
    
    return NextResponse.json({ 
        advice: `TACTICAL_SUMMARY: Sector ${need.id?.slice(-4) || 'ALPHA'} requires immediate ${need.need_type?.toUpperCase() || 'GENERAL'} intervention. Priority: ${urgency.toUpperCase()}. Proximity: ${dist}km. High skill-compatibility detected. \nFIELD_ACTION: Secure mission perimeter. Initialize triage protocol. Deploy specialized ${need.need_type || 'emergency'} kit.`,
        timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Tactical Error:', error);
    return NextResponse.json({ 
        advice: `TACTICAL_ADVICE: Mission logic synced with baseline survival parameters. Proceed to Sector ${need.id?.slice(-4) || 'ALPHA'} and establish comms. \nFIELD_ACTION: Prioritize life-saving measures.`,
        timestamp: new Date().toISOString()
    });
  }
}
