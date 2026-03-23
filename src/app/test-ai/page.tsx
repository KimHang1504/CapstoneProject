'use client';

import { useState } from 'react';
import { generateDescription, generateImage, generateText, imagePrompt } from '@/utils/ai';

export default function TestAIPage() {
  const [venueName, setVenueName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState('');
  
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [customText, setCustomText] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleGenerateDescription = async () => {
    if (!venueName) return alert('Nhập tên venue');
    
    setLoading(true);
    const result = await generateDescription(venueName, {
      category: category || undefined,
      location: location || undefined,
      mood: mood || undefined,
    });
    setLoading(false);
    
    if (result) {
      setDescription(result);
    } else {
      alert('Lỗi khi tạo description');
    }
  };

  const handleGenerateImage = async () => {
    if (!venueName) return alert('Nhập tên venue');
    
    setLoading(true);
    const prompt = imagePrompt.venue(venueName, category || undefined, mood || undefined);
    const result = await generateImage(prompt);
    setLoading(false);
    
    if (result) {
      setImageUrl(result);
    } else {
      alert('Lỗi khi tạo hình ảnh');
    }
  };

  const handleGenerateCustomText = async () => {
    const prompt = window.prompt('Nhập prompt của bạn:');
    if (!prompt) return;
    
    setLoading(true);
    const result = await generateText(prompt);
    setLoading(false);
    
    if (result) {
      setCustomText(result);
    } else {
      alert('Lỗi khi tạo text');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test AI Functions</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin Venue</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên Venue *</label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Nhà hàng Hương Việt"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Nhà hàng, Cafe, Bar..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Địa điểm</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Quận 1, TP.HCM"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Không khí</label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="lãng mạn, sôi động, yên tĩnh..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleGenerateDescription}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Tạo Description'}
            </button>

            <button
              onClick={handleGenerateImage}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Tạo Hình ảnh'}
            </button>

            <button
              onClick={handleGenerateCustomText}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Tạo Text tùy chỉnh'}
            </button>
          </div>
        </div>

        {description && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Description:</h3>
            <p className="text-gray-700">{description}</p>
          </div>
        )}

        {imageUrl && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Hình ảnh:</h3>
            <img src={imageUrl} alt="Generated" className="w-full rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">{imageUrl}</p>
          </div>
        )}

        {customText && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Custom Text:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{customText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
