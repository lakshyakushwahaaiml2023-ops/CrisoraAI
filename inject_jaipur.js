const fs = require('fs');
const path = require('path');

const targetPath = path.join('d:/Lakshya/Hackathons/Hack-A-Sprint-Aurbindo/DisasterManager/DisasterManagementApp-main/src/lib/mock-data.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const getLat = () => (26.85 + Math.random() * 0.1).toFixed(4);
const getLng = () => (75.75 + Math.random() * 0.08).toFixed(4);

// Generate 25 totally new Jaipur victims to append.
let newVictims = [];
const names = ['Amit Rana', 'Pooja Desai', 'Karan Singh', 'Sneha Kapoor', 'Ravi Shankar', 'Priyanka Chopra', 'Deepak Joshi', 'Suresh Menon', 'Anita Raj', 'Vikram Seth', 'Neha Dhupia', 'Mohit Chauhan', 'Sunita Rao', 'Ajay Devgn', 'Rajesh Khanna', 'Kavita Krishnamurthy', 'Arun Govil', 'Sanjay Dutt', 'Lata Mangeshkar', 'Kishore Kumar', 'Asha Bhosle', 'Mohammed Rafi', 'Mukesh', 'Hemant Kumar', 'Manna Dey'];

for(let i=0; i<25; i++) {
    newVictims.push(`  { id: 'vic_jpr_${i}', email: 'vic${i}@jpr.com', phone: '9900000${(100+i)}', role: 'victim', name: '${names[i]}', location: { lat: ${getLat()}, lng: ${getLng()} } },`);
}

// Generate 15 extra volunteers
let newVols = [];
const volNames = ['Veer Pratap', 'Surya Kumar', 'Rani Mukherjee', 'Salman Khan', 'Aamir Khan', 'Shahrukh Khan', 'Hrithik Roshan', 'Ranbir Kapoor', 'Varun Dhawan', 'Sidharth Malhotra', 'Alia Bhatt', 'Katrina Kaif', 'Deepika Padukone', 'Anushka Sharma', 'Kareena Kapoor'];
for(let i=0; i<15; i++) {
    newVols.push(`  { id: 'vol_jpr_${i}', email: 'vol${i}@jpr.com', phone: '9800000${(100+i)}', role: 'volunteer', name: '${volNames[i]}', location: { lat: ${getLat()}, lng: ${getLng()} } },`);
}

// Replace the end of MOCK_USERS array with the new victims and vols
const marker = "];\n\n// ─────────────────────────────────────────────────────────────────────────────\n// MOCK VOLUNTEERS";

content = content.replace(marker, newVictims.join('\n') + '\n' + newVols.join('\n') + '\n' + marker);

// Also we should ensure existing mock users randomly shift to Jaipur just to guarantee massive density.
content = content.replace(/lat: 26\.[0-2][0-9]+/g, () => `lat: ${getLat()}`);
content = content.replace(/lng: 91\.[6-8][0-9]+/g, () => `lng: ${getLng()}`); // shift guwahati to jaipur
content = content.replace(/lat: 10\.[0-9]+/g, () => `lat: ${getLat()}`); // shift kerala to jaipur
content = content.replace(/lng: 76\.[0-9]+/g, () => `lng: ${getLng()}`); 

fs.writeFileSync(targetPath, content, 'utf8');
console.log('injected massive dataset of local jaipur accounts');
