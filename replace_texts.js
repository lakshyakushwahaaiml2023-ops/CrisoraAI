const fs = require('fs');
const path = require('path');

const filePaths = [
    'src/app/dashboard/victim/page.tsx',
    'src/components/simulation/GovernmentMiniView.tsx',
    'src/components/simulation/VictimMiniView.tsx',
    'src/app/emergency/page.tsx',
    'src/components/Map/LiveMap.tsx'
];

const replacements = [
    [/Distress_Detected/g, 'Distress Detected'],
    [/TRIGGERING_EMERGENCY_SOS_IN/g, 'TRIGGERING EMERGENCY SOS IN'],
    [/FALSE_ALARM \/ CANCEL/g, 'FALSE ALARM / CANCEL'],
    [/Stationary_Alert/g, 'Stationary Alert'],
    [/I_AM_SAFE/g, 'I AM SAFE'],
    [/HANDS_FREE_ACTIVE/g, 'HANDS-FREE ACTIVE'],
    [/ALPHA_SYSTEM_STDBY/g, 'SYSTEM STANDBY'],
    [/HOLD_TO_TRIGGER_MIGRATION/g, 'HOLD TO REQUEST ASSISTANCE'],
    [/Emergency_Trigger_Detected/g, 'Emergency Trigger Detected'],
    [/Distress_Signal/g, 'Distress Signal'],
    [/Detecting_Urgency/g, 'Detecting Urgency'],
    [/Signal_High/g, 'High Priority'],
    [/Signal_Alpha_Zero/g, 'Critical Priority'],
    [/Registry_Dispatch/g, 'Submit Report'],
    [/Signal_Log/g, 'Signal Log'],
    [/Mission_Status/g, 'Status'],
    [/Logged_Relay/g, 'Logged Time'],
    [/No_Historical_Telemetry/g, 'No Historical Data'],
    [/Local_Mobilization/g, 'Local Mobilization'],
    [/Mission_Radar/g, 'Nearby Search'],
    [/Accept_Field_Mission/g, 'Accept Task'],
    [/Survival_Directives/g, 'Safety Tools'],
    [/Signal_Beacon/g, 'Flashlight'],
    [/Siren_Link/g, 'Siren Alert'],
    [/'radar': "Radar"/g, "'radar': \"Map\""],
    [/\{ id: 'map', label: 'Radar'/g, "{ id: 'map', label: 'Map View'"],
    [/\{ id: 'tools', label: 'Kit'/g, "{ id: 'tools', label: 'Tools'"],
    [/Govt\. Command \(Triage\)/g, "Command Center"],
    [/Global Alert\.\.\./g, "Global Notification..."],
    [/Global SMS Alert\.\.\./g, "Global SMS Notification..."],
    [/\[INTELLIGENT_SOS_TRIGGER\]/g, "[AUTOMATED SOS]"],
    [/\[AUTO_ESCALATION\] PERSISTENT_LEAD_MISSION\. UNRESPONSIVE_VICTIM\./g, "[ESCALATION] PERSISTENT SIGNAL. UNRESPONSIVE CITIZEN."],
    [/AUTOMATIC PANIC SIGNAL - IMMEDIATE EXTRACTION REQUIRED/g, 'AUTOMATIC PANIC SIGNAL - IMMEDIATE ASSISTANCE REQUIRED'],
    [/\[NDRS ALERT\]/g, '[EMERGENCY ALERT]'],
    [/\[NDRS URGENT\]/g, '[URGENT]'],
    [/\[NDRS NOTIFICATION\]/g, '[NOTIFICATION]'],
    [/GRID_ENABLED: SATELLITE_LINK_ACTIVE/g, ''],
    [/Global Rescue Protocol/g, 'Emergency Protocol'],
    [/Strategic AI/g, 'Automated Analysis'],
    [/TacticalTelemetry/g, 'Overview'],
    [/OracleTacticalScanner/g, 'Data Scanner']
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
