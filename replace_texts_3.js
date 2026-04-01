const fs = require('fs');
const path = require('path');

const filePaths = ['src/app/dashboard/volunteer/page.tsx'];
const replacements = [
    [/TACTICAL_ADVISORY:/g, 'SYSTEM ADVISORY:'],
    [/MISSION_ID_/g, 'TASK_ID_'],
    [/PRORITY_SHIFT/g, 'PRIORITY SHIFT'],
    [/ESTIMATED_IMPACT_ZONE_/g, 'IMPACT ZONE: '],
    [/FIELD_SAFETY_RATING_/g, 'SAFETY RATING: '],
    [/SYSTEM_TACTICAL_ALERT: GEOSPATIAL_BURST/g, 'SYSTEM ALERT: GEOSPATIAL ANOMALY'],
    [/Inter-Agency_Status/g, 'Inter-Agency Status'],
    [/MOBILIZING_ALL_VOLUNTEER_UNITS/g, 'MOBILIZING VOLUNTEERS'],
    [/ACKNOWLEDGE_RADAR/g, 'ACKNOWLEDGE'],
    [/Active_Mission_Units/g, 'Active Tasks'],
    [/FIELD_ENGAGEMENT/g, 'FIELD ENGAGEMENT'],
    [/Operational_Triage_Queue/g, 'Triage Queue'],
    [/AWAITING_COMMIT/g, 'UNASSIGNED'],
    [/Success_Committals/g, 'Completed Tasks'],
    [/REGISTRY_STABLE/g, 'DATABASE SYNCED'],
    [/Field_Identity_Status/g, 'Status'],
    [/ENCRYPTED_ID/g, 'VERIFIED'],
    [/MISSION_QUEUES/g, 'TASK QUEUE'],
    [/DISPATCH/g, 'UNASSIGNED TASKS'],
    [/COMMIT_MISSION/g, 'ACCEPT TASK'],
    [/TACTICAL_FIELD_ADVISORY/g, 'FIELD ADVISORY'],
    [/INTERFRET_MODE_ACTIVE/g, 'SYSTEM ACTIVE'],
    [/FINALIZE_RESCUE/g, 'COMPLETE TASK'],
    [/Awaiting_Field_Commitment/g, 'Awaiting Task Assignment']
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
