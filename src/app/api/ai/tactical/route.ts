import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { need, volunteer, nearbyCamps } = await req.json();

    const systemPrompt = `
      You are "THE SENTINEL", a high-performance Tactical AI for Disaster Response Volunteers.
      Your goal is to analyze a MISSION and provide a 2-sentence battlefield logic summary for the volunteer.

      ANALYSIS PARAMETERS:
      - Mission Urgency: ${need.urgency_label} (${need.urgency_level}/100)
      - Proximity: ${need.distance || 'Calculated field'} km
      - Volunteer Skills: ${volunteer.skills.join(', ')}
      - Nearby Camps: ${nearbyCamps.length} active hubs detected.

      FORMAT YOUR RESPONSE:
      1. TACTICAL_SUMMARY: Why take this mission? (Proximity/Skill-fit)
      2. FIELD_ACTION: One immediate next step (e.g., grab a specific kit from a specific camp).

      BE CONCISE. TACTICAL. AUTHORITATIVE.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
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

    const data = await response.json();
    return NextResponse.json({ 
        advice: data.choices[0].message.content,
        timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ error: 'AI Tactical Analysis Offline' }, { status: 500 });
  }
}
