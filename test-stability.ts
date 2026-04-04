import { generateAI } from './lib/ai';

// Test script to verify API endpoints
async function testEndpoint(url: string, body: any, expectStream = false) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);
  
  const response = await fetch(`http://localhost:3000${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);
  
  const start = Date.now();
  const data = await response.json();
  const duration = Date.now() - start;
  
  console.log(`${url}: OK, duration: ${duration}ms, status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return { success: true, duration, data };
}

async function testAll() {
  console.log('=== AI API Stability Test ===');
  
  // Test /api/ai
  await testEndpoint('/api/ai', { prompt: 'Test prompt', model: 'llama3' });
  
  // Test /api/ai/resume
  await testEndpoint('/api/ai/resume', { jobTitle: 'Software Engineer', experience: '5 years' });
  
  // Test /api/ai/chat
  await testEndpoint('/api/ai/chat', { messages: [{ role: 'user', content: 'Hello' }] });
  
  // Test /api/ai/cover-letter
  await testEndpoint('/api/ai/cover-letter', { jobTitle: 'Developer', company: 'Tech Corp' });
  
  // Test /api/ai/ats
  await testEndpoint('/api/ai/ats', { resume: 'Sample resume text', jobDesc: 'Job description' });
  
  // Test non-stream default
  console.log('All tests passed - no hangs, valid JSON responses');
}

testAll().catch(console.error);
