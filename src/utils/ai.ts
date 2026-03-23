import { venueDescriptionPrompt, imagePrompt } from './ai-prompts';

type DescriptionOptions = {
  category?: string;
  location?: string;
  mood?: string;
  maxLength?: number;
};

type ImageOptions = {
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
};

export async function generateDescription(
  venueName: string,
  options?: DescriptionOptions
): Promise<string | null> {
  try {
    const { category, location, mood, maxLength = 200 } = options || {};

    const res = await fetch(`${process.env.NEXT_PUBLIC_AI_TEXT_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_TEXT_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_AI_TEXT_MODEL,
        messages: [
          { role: 'system', content: venueDescriptionPrompt.system() },
          { role: 'user', content: venueDescriptionPrompt.user(venueName, category, location, mood, maxLength) },
        ],
        max_tokens: maxLength * 2,
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function generateImage(
  prompt: string,
  options?: ImageOptions
): Promise<string | null> {
  try {
    const { size = '1024x1024', quality = 'standard', style = 'vivid' } = options || {};

    const res = await fetch(`${process.env.NEXT_PUBLIC_AI_IMAGE_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_IMAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_AI_IMAGE_MODEL,
        prompt,
        n: 1,
        size,
        quality,
        style,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0]?.url || null;
  } catch {
    return null;
  }
}

export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AI_TEXT_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_TEXT_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_AI_TEXT_MODEL,
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export { imagePrompt };
