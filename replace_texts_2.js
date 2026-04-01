const fs = require('fs');
const path = require('path');

const filePaths = [
    'src/app/dashboard/government/page.tsx',
    'src/components/simulation/GovernmentMiniView.tsx',
    'src/components/simulation/VictimMiniView.tsx',
    'src/app/emergency/page.tsx',
    'src/app/dashboard/victim/page.tsx'
];

const replacements = [
    [/Casualty_Metrics/g, 'Casualty Metrics'],
    [/CRITICAL_ALPHA/g, 'CRITICAL PRIORITY'],
    [/Joint_Responders/g, 'Active Volunteers'],
    [/FIELD_RESP_SYNC/g, 'FIELD RESPONDERS'],
    [/Coordinated_Load/g, 'Active Tasks'],
    [/Multi-Agency_Comms/g, 'Communication Status'],
    [/ENCRYPT_CLEAR/g, 'SYSTEM SECURE'],
    [/GIS_TACTICAL_DATA/g, 'MAP OVERVIEW'],
    [/MITIGATION_ANALYTICS/g, 'ANALYTICS'],
    [/SAT_UPLINK_STABLE/g, 'CONNECTION STABLE'],
    [/AI_OPERATIONS_ADVISORY/g, 'AUTOMATED ADVISORY'],
    [/Government_SitRep/g, 'Situation Report'],
    [/Emergency_Directive/g, 'Emergency Directive'],
    [/NATIONAL_LOCKDOWN_DIRECTIVE_LEVEL_2/g, 'ISSUE LOCKDOWN DIRECTIVE'],
    [/COMMIT_MISSION_DIRECTIVE/g, 'ISSUE DIRECTIVE'],
    [/\[ALERT_CODE_DELTA\]: GEOSPATIAL_BURST_DETECTED\./g, 'GEOSPATIAL ANOMALY DETECTED.'],
    [/JOINT_COMMAND_SYNCED:/g, 'COMMAND UPDATED:'],
    [/ACTION: OVERSEE_SITUATION_ROOM\./g, 'ACTION: MONITOR SITUATION.'],
    [/STRATEGIC_ADVISORY: INITIATE_HOSPITAL_ALERT_LEVEL_4\./g, 'SYSTEM ADVISORY: INITIATE HOSPITAL ALERT.'],
    [/DISPATCH_NDRF_RESERVES_TO_GEO_CORD_/g, 'DISPATCH RELIEF RESOURCES TO COORDS '],
    [/RADIUS_IMPACT:/g, 'IMPACT RADIUS:'],
    [/\[INTELLIGENT_SOS_TRIGGER\] - Distress detected via interaction telemetry\./g, 'Automated SOS generated due to critical indicators.'],
    [/TRIGGERING EMERGENCY SOS IN/g, 'INITIATING EMERGENCY SOS IN']
];

for (const p of filePaths) {
    const fullPath = path.join('d:/Lakshya/Hackathons/Hack-A-Sprint-Aurbindo/DisasterManager/DisasterManagementApp-main', p);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        for (const [regex, replacement] of replacements) {
            content = content.replace(regex, replacement);
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Updated", p);
    }
}
