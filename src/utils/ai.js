export async function breakDownTask(task) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Break down the following task into a short list of actionable sub tasks:\n"${task}"`,
          },
        ],
      }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    return text
      .split(/\n|\r/) // split lines
      .map(t => t.replace(/^[-*\d\.\s]+/, '').trim())
      .filter(Boolean);
  } catch (e) {
    console.warn('Failed to break down task', e);
    return [];
  }
}

export function prioritizeTask(dueDate) {
  if (!dueDate) return 'Low';
  const due = new Date(dueDate);
  const now = new Date();
  const diff = (due - now) / (1000 * 60 * 60 * 24); // days
  if (diff <= 1) return 'High';
  if (diff <= 3) return 'Medium';
  return 'Low';
}
