export const venueDescriptionPrompt = {
  system: () => 'Bạn là chuyên gia viết mô tả địa điểm du lịch và giải trí hấp dẫn.',

  user: (
    venueName: string,
    category?: string,
    location?: string,
    mood?: string,
    maxLength: number = 200
  ) => {
    let text = `Viết mô tả hấp dẫn cho "${venueName}"`;
    if (category) text += ` thuộc ${category}`;
    if (location) text += ` tại ${location}`;
    if (mood) text += ` với không khí ${mood}`;
    text += `. Ngắn gọn ${maxLength} từ, thu hút, chuyên nghiệp.`;
    return text;
  },
};

export const imagePrompt = {
  venue: (venueName: string, category?: string, mood?: string) => {
    let text = `Beautiful ${category || 'venue'} "${venueName}"`;
    if (mood) text += ` ${mood} atmosphere`;
    text += ', professional photo, high quality, detailed';
    return text;
  },
};
