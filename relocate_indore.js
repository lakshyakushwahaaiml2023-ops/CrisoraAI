const fs = require('fs');
const path = require('path');

// Indore, MP centre coordinates: 22.7196, 75.8577
// Spread accounts in a ~5km radius around Indore
const getLat = () => (22.68 + Math.random() * 0.08).toFixed(4);
const getLng = () => (75.82 + Math.random() * 0.08).toFixed(4);

const files = [
  'src/lib/mock-data.ts',
  'src/app/page.tsx',
];

for (const rel of files) {
  const fullPath = path.join('d:/Lakshya/Hackathons/Hack-A-Sprint-Aurbindo/DisasterManager/DisasterManagementApp-main', rel);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace all existing lat/lng pairs that belonged to Jaipur (~26.8-26.95, 75.75-75.83)
  // and Assam/Kerala leftover coords
  content = content.replace(/lat:\s*26\.\d+/g, () => `lat: ${getLat()}`);
  content = content.replace(/lat:\s*10\.\d+/g, () => `lat: ${getLat()}`);
  content = content.replace(/lng:\s*75\.\d+/g, () => `lng: ${getLng()}`);
  content = content.replace(/lng:\s*76\.\d+/g, () => `lng: ${getLng()}`);
  content = content.replace(/lng:\s*91\.\d+/g, () => `lng: ${getLng()}`);

  // Update region label text
  content = content.replace(/Jaipur, Rajasthan/g, 'Indore, Madhya Pradesh');
  content = content.replace(/Jaipur Region/g, 'Indore Region');
  content = content.replace(/Jaipur Node/g, 'Indore Node');
  content = content.replace(/Jaipur\b/g, 'Indore');
  content = content.replace(/Rajasthan\b/g, 'Madhya Pradesh');
  content = content.replace(/NDRF Unit 4, Rajasthan/g, 'NDRF Unit 9, Madhya Pradesh');
  content = content.replace(/JLN Marg, Jaipur Base/g, 'Vijay Nagar, Indore Base');
  content = content.replace(/Rajasthan State Command Center/g, 'MP State Emergency Command Centre');
  content = content.replace(/Sector 5, Mansarovar, Jaipur/g, 'Scheme 78, Vijay Nagar, Indore');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated', rel);
}

// Now also patch the mock-data scenarios and risk zones
const mockPath = path.join('d:/Lakshya/Hackathons/Hack-A-Sprint-Aurbindo/DisasterManager/DisasterManagementApp-main', 'src/lib/mock-data.ts');
let mock = fs.readFileSync(mockPath, 'utf8');

// Replace region strings
mock = mock.replace(/Guwahati Riverside North/g, 'Indore Riverside North');
mock = mock.replace(/South Jaipur Lowlands/g, 'South Indore Lowlands');
mock = mock.replace(/Guwahati/g, 'Indore City');
mock = mock.replace(/Brahmaputra/g, 'Narmada');
mock = mock.replace(/Rajasthan/g, 'Madhya Pradesh');

fs.writeFileSync(mockPath, mock, 'utf8');
console.log('Region labels updated in mock-data.ts');
