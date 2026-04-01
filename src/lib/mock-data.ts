import { User, Volunteer, NGO, Need, Scenario, RiskZone, ResourceInventory } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK USERS (Mission Control Registry)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'govt@relief.gov.in', phone: '9999999999', role: 'government', name: 'District Collector, Indore', location: { lat: 22.7196, lng: 75.8577 } },
  
  // Volunteers (v1-v10)
  { id: 'v1', email: 'rajesh@vol.com', phone: '9876543210', role: 'volunteer', name: 'Rajesh Kumar', location: { lat: 22.7018, lng: 75.8845 } },
  { id: 'v2', email: 'priya@vol.com', phone: '9876543211', role: 'volunteer', name: 'Priya Sharma', location: { lat: 22.7231, lng: 75.8513 } },
  { id: 'v3', email: 'ankit@vol.com', phone: '9876543214', role: 'volunteer', name: 'Ankit Verma', location: { lat: 22.6812, lng: 75.8308 } },
  { id: 'v4', email: 'kavita@vol.com', phone: '9876543215', role: 'volunteer', name: 'Kavita Nair', location: { lat: 22.6871, lng: 75.8630 } },
  { id: 'v5', email: 'arjun.s@ndrs.vol', phone: '9123456789', role: 'volunteer', name: 'Arjun Singh', location: { lat: 22.6803, lng: 75.8998 } },
  { id: 'v6', email: 'sunita.g@ndrs.vol', phone: '9123456790', role: 'volunteer', name: 'Sunita Gogoi', location: { lat: 22.7460, lng: 75.8265 } },
  { id: 'v7', email: 'lakshya.b@ndrs.vol', phone: '9123456791', role: 'volunteer', name: 'Lakshya Bordoloi', location: { lat: 22.6890, lng: 75.8287 } },
  { id: 'v8', email: 'vikram.t@ndrs.vol', phone: '9123456792', role: 'volunteer', name: 'Vikram Talukdar', location: { lat: 22.7198, lng: 75.8216 } },
  { id: 'v9', email: 'meera.k@ndrs.vol', phone: '9123456793', role: 'volunteer', name: 'Meera Kalita', location: { lat: 22.7166, lng: 75.8574 } },
  { id: 'v10', email: 'deepak.c@ndrs.vol', phone: '9123456794', role: 'volunteer', name: 'Deepak Chetia', location: { lat: 22.7532, lng: 75.8662 } },

  // NGOs (n1-n5)
  { id: 'n1', email: 'redcross@ngo.com', phone: '9876543212', role: 'ngo', name: 'Red Cross Madhya Pradesh', location: { lat: 22.7369, lng: 75.8610 } },
  { id: 'n2', email: 'helpindia@ngo.com', phone: '9876543216', role: 'ngo', name: 'Help India Foundation', location: { lat: 22.7093, lng: 75.8413 } },
  { id: 'n3', email: 'assam.rising@ngo.org', phone: '9923456701', role: 'ngo', name: 'Assam Rising Trust', location: { lat: 22.7356, lng: 75.8640 } },
  { id: 'n4', email: 'guwahati.med@ngo.org', phone: '9923456702', role: 'ngo', name: 'Indore City Medical Corps', location: { lat: 22.7125, lng: 75.8910 } },
  { id: 'n5', email: 'ne.logistics@ngo.org', phone: '9923456703', role: 'ngo', name: 'NE Logistics Exchange', location: { lat: 22.7343, lng: 75.8274 } },

  // Victims (vic1-vic21)
  { id: 'vic1', email: 'arav@vic.com', phone: '9876543213', role: 'victim', name: 'Aarav Gupta', location: { lat: 22.6870, lng: 75.8667 } },
  { id: 'vic2', email: 'rohan.d@vic.in', phone: '9000000001', role: 'victim', name: 'Rohan Das', location: { lat: 22.7488, lng: 75.8820 } },
  { id: 'vic3', email: 'sara.b@vic.in', phone: '9000000002', role: 'victim', name: 'Sara Baruah', location: { lat: 22.7340, lng: 75.8766 } },
  { id: 'vic4', email: 'lokesh.m@vic.in', phone: '9000000003', role: 'victim', name: 'Lokesh Medhi', location: { lat: 22.7435, lng: 75.8506 } },
  { id: 'vic5', email: 'ananya.s@vic.in', phone: '9000000004', role: 'victim', name: 'Ananya Saikia', location: { lat: 22.6910, lng: 75.8601 } },
  { id: 'vic6', email: 'jyoti.k@vic.in', phone: '9000000005', role: 'victim', name: 'Jyoti Kalita', location: { lat: 22.7063, lng: 75.8710 } },
  { id: 'vic7', email: 'pritam.h@vic.in', phone: '9000000006', role: 'victim', name: 'Pritam Hazarika', location: { lat: 22.7581, lng: 75.8530 } },
  { id: 'vic8', email: 'neha.p@vic.in', phone: '9000000007', role: 'victim', name: 'Neha Patowary', location: { lat: 22.6973, lng: 75.8243 } },
  { id: 'vic9', email: 'rajesh.b@vic.in', phone: '9000000008', role: 'victim', name: 'Rajesh Bora', location: { lat: 22.7371, lng: 75.8816 } },
  { id: 'vic10', email: 'tripti.d@vic.in', phone: '9000000009', role: 'victim', name: 'Tripti Dutta', location: { lat: 22.7400, lng: 75.8642 } },
  { id: 'vic11', email: 'bikram.s@vic.in', phone: '9000000010', role: 'victim', name: 'Bikram Sharma', location: { lat: 22.7470, lng: 75.8741 } },
  { id: 'vic12', email: 'mousumi.k@vic.in', phone: '9000000011', role: 'victim', name: 'Mousumi Kataki', location: { lat: 22.6922, lng: 75.8928 } },
  { id: 'vic13', email: 'rahul.t@vic.in', phone: '9000000012', role: 'victim', name: 'Rahul Talukdar', location: { lat: 22.7193, lng: 75.8231 } },
  { id: 'vic14', email: 'pallavi.g@vic.in', phone: '9000000013', role: 'victim', name: 'Pallavi Goswami', location: { lat: 22.7061, lng: 75.8554 } },
  { id: 'vic15', email: 'dipankar.n@vic.in', phone: '9000000014', role: 'victim', name: 'Dipankar Nath', location: { lat: 22.7548, lng: 75.8397 } },
  { id: 'vic16', email: 'reema.b@vic.in', phone: '9000000015', role: 'victim', name: 'Reema Baishya', location: { lat: 22.7000, lng: 75.8803 } },
  { id: 'vic17', email: 'manoj.p@vic.in', phone: '9000000016', role: 'victim', name: 'Manoj Phukan', location: { lat: 22.6864, lng: 75.8805 } },
  { id: 'vic18', email: 'sumit.m@vic.in', phone: '9000000017', role: 'victim', name: 'Sumit Mahanta', location: { lat: 22.6865, lng: 75.8801 } },
  { id: 'vic19', email: 'shikha.t@vic.in', phone: '9000000018', role: 'victim', name: 'Shikha Tiwari', location: { lat: 22.7098, lng: 75.8380 } },
  { id: 'vic20', email: 'bikash.s@vic.in', phone: '9000000019', role: 'victim', name: 'Bikash Sarma', location: { lat: 22.7429, lng: 75.8335 } },
  { id: 'vic21', email: 'pankaj.d@vic.in', phone: '9000000020', role: 'victim', name: 'Pankaj Deori', location: { lat: 22.7415, lng: 75.8985 } },
  { id: 'vic_jpr_0', email: 'vic0@jpr.com', phone: '9900000100', role: 'victim', name: 'Amit Rana', location: { lat: 22.7206, lng: 75.8664 } },
  { id: 'vic_jpr_1', email: 'vic1@jpr.com', phone: '9900000101', role: 'victim', name: 'Pooja Desai', location: { lat: 22.7483, lng: 75.8769 } },
  { id: 'vic_jpr_2', email: 'vic2@jpr.com', phone: '9900000102', role: 'victim', name: 'Karan Singh', location: { lat: 22.7386, lng: 75.8261 } },
  { id: 'vic_jpr_3', email: 'vic3@jpr.com', phone: '9900000103', role: 'victim', name: 'Sneha Kapoor', location: { lat: 22.7319, lng: 75.8771 } },
  { id: 'vic_jpr_4', email: 'vic4@jpr.com', phone: '9900000104', role: 'victim', name: 'Ravi Shankar', location: { lat: 22.7510, lng: 75.8207 } },
  { id: 'vic_jpr_5', email: 'vic5@jpr.com', phone: '9900000105', role: 'victim', name: 'Priyanka Chopra', location: { lat: 22.7188, lng: 75.8939 } },
  { id: 'vic_jpr_6', email: 'vic6@jpr.com', phone: '9900000106', role: 'victim', name: 'Deepak Joshi', location: { lat: 22.6824, lng: 75.8312 } },
  { id: 'vic_jpr_7', email: 'vic7@jpr.com', phone: '9900000107', role: 'victim', name: 'Suresh Menon', location: { lat: 22.7418, lng: 75.8284 } },
  { id: 'vic_jpr_8', email: 'vic8@jpr.com', phone: '9900000108', role: 'victim', name: 'Anita Raj', location: { lat: 22.7051, lng: 75.8531 } },
  { id: 'vic_jpr_9', email: 'vic9@jpr.com', phone: '9900000109', role: 'victim', name: 'Vikram Seth', location: { lat: 22.6838, lng: 75.8288 } },
  { id: 'vic_jpr_10', email: 'vic10@jpr.com', phone: '9900000110', role: 'victim', name: 'Neha Dhupia', location: { lat: 22.6825, lng: 75.8404 } },
  { id: 'vic_jpr_11', email: 'vic11@jpr.com', phone: '9900000111', role: 'victim', name: 'Mohit Chauhan', location: { lat: 22.7481, lng: 75.8854 } },
  { id: 'vic_jpr_12', email: 'vic12@jpr.com', phone: '9900000112', role: 'victim', name: 'Sunita Rao', location: { lat: 22.6864, lng: 75.8244 } },
  { id: 'vic_jpr_13', email: 'vic13@jpr.com', phone: '9900000113', role: 'victim', name: 'Ajay Devgn', location: { lat: 22.7127, lng: 75.8434 } },
  { id: 'vic_jpr_14', email: 'vic14@jpr.com', phone: '9900000114', role: 'victim', name: 'Rajesh Khanna', location: { lat: 22.7266, lng: 75.8225 } },
  { id: 'vic_jpr_15', email: 'vic15@jpr.com', phone: '9900000115', role: 'victim', name: 'Kavita Krishnamurthy', location: { lat: 22.7459, lng: 75.8793 } },
  { id: 'vic_jpr_16', email: 'vic16@jpr.com', phone: '9900000116', role: 'victim', name: 'Arun Govil', location: { lat: 22.7285, lng: 75.8771 } },
  { id: 'vic_jpr_17', email: 'vic17@jpr.com', phone: '9900000117', role: 'victim', name: 'Sanjay Dutt', location: { lat: 22.7462, lng: 75.8809 } },
  { id: 'vic_jpr_18', email: 'vic18@jpr.com', phone: '9900000118', role: 'victim', name: 'Lata Mangeshkar', location: { lat: 22.7285, lng: 75.8842 } },
  { id: 'vic_jpr_19', email: 'vic19@jpr.com', phone: '9900000119', role: 'victim', name: 'Kishore Kumar', location: { lat: 22.6993, lng: 75.8514 } },
  { id: 'vic_jpr_20', email: 'vic20@jpr.com', phone: '9900000120', role: 'victim', name: 'Asha Bhosle', location: { lat: 22.7541, lng: 75.8701 } },
  { id: 'vic_jpr_21', email: 'vic21@jpr.com', phone: '9900000121', role: 'victim', name: 'Mohammed Rafi', location: { lat: 22.7194, lng: 75.8315 } },
  { id: 'vic_jpr_22', email: 'vic22@jpr.com', phone: '9900000122', role: 'victim', name: 'Mukesh', location: { lat: 22.6826, lng: 75.8572 } },
  { id: 'vic_jpr_23', email: 'vic23@jpr.com', phone: '9900000123', role: 'victim', name: 'Hemant Kumar', location: { lat: 22.7302, lng: 75.8234 } },
  { id: 'vic_jpr_24', email: 'vic24@jpr.com', phone: '9900000124', role: 'victim', name: 'Manna Dey', location: { lat: 22.6966, lng: 75.8797 } },
  { id: 'vol_jpr_0', email: 'vol0@jpr.com', phone: '9800000100', role: 'volunteer', name: 'Veer Pratap', location: { lat: 22.7171, lng: 75.8482 } },
  { id: 'vol_jpr_1', email: 'vol1@jpr.com', phone: '9800000101', role: 'volunteer', name: 'Surya Kumar', location: { lat: 22.7087, lng: 75.8647 } },
  { id: 'vol_jpr_2', email: 'vol2@jpr.com', phone: '9800000102', role: 'volunteer', name: 'Rani Mukherjee', location: { lat: 22.7347, lng: 75.8333 } },
  { id: 'vol_jpr_3', email: 'vol3@jpr.com', phone: '9800000103', role: 'volunteer', name: 'Salman Khan', location: { lat: 22.7336, lng: 75.8660 } },
  { id: 'vol_jpr_4', email: 'vol4@jpr.com', phone: '9800000104', role: 'volunteer', name: 'Aamir Khan', location: { lat: 22.7335, lng: 75.8431 } },
  { id: 'vol_jpr_5', email: 'vol5@jpr.com', phone: '9800000105', role: 'volunteer', name: 'Shahrukh Khan', location: { lat: 22.7424, lng: 75.8936 } },
  { id: 'vol_jpr_6', email: 'vol6@jpr.com', phone: '9800000106', role: 'volunteer', name: 'Hrithik Roshan', location: { lat: 22.6976, lng: 75.8309 } },
  { id: 'vol_jpr_7', email: 'vol7@jpr.com', phone: '9800000107', role: 'volunteer', name: 'Ranbir Kapoor', location: { lat: 22.7165, lng: 75.8292 } },
  { id: 'vol_jpr_8', email: 'vol8@jpr.com', phone: '9800000108', role: 'volunteer', name: 'Varun Dhawan', location: { lat: 22.7040, lng: 75.8773 } },
  { id: 'vol_jpr_9', email: 'vol9@jpr.com', phone: '9800000109', role: 'volunteer', name: 'Sidharth Malhotra', location: { lat: 22.7037, lng: 75.8300 } },
  { id: 'vol_jpr_10', email: 'vol10@jpr.com', phone: '9800000110', role: 'volunteer', name: 'Alia Bhatt', location: { lat: 22.7294, lng: 75.8434 } },
  { id: 'vol_jpr_11', email: 'vol11@jpr.com', phone: '9800000111', role: 'volunteer', name: 'Katrina Kaif', location: { lat: 22.7295, lng: 75.8523 } },
  { id: 'vol_jpr_12', email: 'vol12@jpr.com', phone: '9800000112', role: 'volunteer', name: 'Deepika Padukone', location: { lat: 22.6832, lng: 75.8481 } },
  { id: 'vol_jpr_13', email: 'vol13@jpr.com', phone: '9800000113', role: 'volunteer', name: 'Anushka Sharma', location: { lat: 22.7241, lng: 75.8447 } },
  { id: 'vol_jpr_14', email: 'vol14@jpr.com', phone: '9800000114', role: 'volunteer', name: 'Kareena Kapoor', location: { lat: 22.6994, lng: 75.8775 } },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK VOLUNTEERS (Specialized Units)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_VOLUNTEERS: Volunteer[] = [
  { ...MOCK_USERS[1], skills: ['medical', 'rescue'], availability: 8, languages: ['Hindi', 'English'], vehicle_access: true, vehicle_type: 'Motorcycle', tasks_completed: 47, people_helped: 234, rating: 4.8, online: true },
  { ...MOCK_USERS[2], skills: ['logistics', 'general'], availability: 4, languages: ['Hindi'], vehicle_access: false, tasks_completed: 12, people_helped: 45, rating: 4.5, online: false },
  { ...MOCK_USERS[3], skills: ['medical', 'first_aid', 'chemical_hazmat'], availability: 6, languages: ['Hindi', 'English', 'Gujarati'], vehicle_access: true, vehicle_type: 'Van', tasks_completed: 89, people_helped: 412, rating: 4.9, online: true },
  { ...MOCK_USERS[4], skills: ['logistics', 'food_distribution', 'shelter'], availability: 8, languages: ['Hindi', 'Tamil', 'English'], vehicle_access: true, vehicle_type: 'Truck', tasks_completed: 31, people_helped: 178, rating: 4.7, online: true },
  { ...MOCK_USERS[5], skills: ['rescue', 'diving', 'first_aid'], availability: 10, languages: ['Hindi', 'English', 'Assamese'], vehicle_access: true, vehicle_type: 'SUV', tasks_completed: 15, people_helped: 62, rating: 4.9, online: true },
  { ...MOCK_USERS[6], skills: ['medical', 'infant_care'], availability: 8, languages: ['Hindi', 'Assamese', 'Bodo'], vehicle_access: false, tasks_completed: 8, people_helped: 45, rating: 4.7, online: true },
  { ...MOCK_USERS[7], skills: ['logistics', 'heavy_machinery'], availability: 6, languages: ['English', 'Assamese'], vehicle_access: true, vehicle_type: 'Tractor', tasks_completed: 23, people_helped: 88, rating: 4.6, online: true },
  { ...MOCK_USERS[8], skills: ['rescue', 'swimming', 'climbing'], availability: 12, languages: ['Hindi', 'Assamese'], vehicle_access: true, vehicle_type: 'Motorcycle', tasks_completed: 54, people_helped: 210, rating: 4.8, online: true },
  { ...MOCK_USERS[9], skills: ['medical', 'pharmacy'], availability: 8, languages: ['Hindi', 'English'], vehicle_access: false, tasks_completed: 12, people_helped: 94, rating: 4.5, online: true },
  { ...MOCK_USERS[10], skills: ['general', 'translation'], availability: 4, languages: ['Assamese', 'Bodo', 'Hindi'], vehicle_access: false, tasks_completed: 5, people_helped: 12, rating: 4.4, online: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK NGOS (Regional Infrastructure)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_NGOS: NGO[] = [
  { ...MOCK_USERS[11], org_name: 'Red Cross Madhya Pradesh', hq_location: { lat: 22.7143, lng: 75.8824 }, staff_count: 50 },
  { ...MOCK_USERS[12], org_name: 'Help India Foundation', hq_location: { lat: 22.7430, lng: 75.8521 }, staff_count: 120 },
  { ...MOCK_USERS[13], org_name: 'Assam Rising Trust', hq_location: { lat: 22.7270, lng: 75.8776 }, staff_count: 85 },
  { ...MOCK_USERS[14], org_name: 'Indore City Medical Corps', hq_location: { lat: 22.7178, lng: 75.8483 }, staff_count: 500 },
  { ...MOCK_USERS[15], org_name: 'NE Logistics Exchange', hq_location: { lat: 22.6918, lng: 75.8914 }, staff_count: 240 },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK INVENTORY (National Resource Exchange)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_INVENTORY: ResourceInventory[] = [
  { id: 'inv1', ngo_id: 'n1', resource_type: 'food', item_name: 'Rice Bags (5kg)', quantity: 500, unit: 'bags', location: { lat: 22.7307, lng: 75.8772 }, available: true },
  { id: 'inv2', ngo_id: 'n1', resource_type: 'medicine', item_name: 'First Aid Kits', quantity: 200, unit: 'kits', location: { lat: 22.7578, lng: 75.8755 }, available: true },
  { id: 'inv3', ngo_id: 'n2', resource_type: 'medicine', item_name: 'Gas Antidotes', quantity: 80, unit: 'vials', location: { lat: 22.7235, lng: 75.8390 }, available: true },
  { id: 'inv4', ngo_id: 'n2', resource_type: 'shelter', item_name: 'Relief Tents', quantity: 150, unit: 'units', location: { lat: 22.7526, lng: 75.8939 }, available: true },
  { id: 'inv5', ngo_id: 'n1', resource_type: 'vehicle', item_name: 'Rescue Boats', quantity: 12, unit: 'boats', location: { lat: 22.7497, lng: 75.8537 }, available: true },
  { id: 'inv6', ngo_id: 'n3', resource_type: 'vehicle', item_name: 'Swift Water Inflatables', quantity: 8, unit: 'boats', location: { lat: 22.7145, lng: 75.8417 }, available: true },
  { id: 'inv7', ngo_id: 'n4', resource_type: 'medicine', item_name: 'Insulin Vials', quantity: 300, unit: 'vials', location: { lat: 22.6811, lng: 75.8537 }, available: true },
  { id: 'inv8', ngo_id: 'n4', resource_type: 'medicine', item_name: 'Anti-Venom (Polyvalent)', quantity: 45, unit: 'units', location: { lat: 22.7224, lng: 75.8231 }, available: true },
  { id: 'inv9', ngo_id: 'n5', resource_type: 'food', item_name: 'High-Protein Infant Formula', quantity: 400, unit: 'boxes', location: { lat: 22.7140, lng: 75.8762 }, available: true },
  { id: 'inv10', ngo_id: 'n5', resource_type: 'food', item_name: 'Clean Drinking Water (20L)', quantity: 1200, unit: 'jars', location: { lat: 22.7058, lng: 75.8466 }, available: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK NEEDS (Primary Rescue Signal Registry)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_NEEDS: Need[] = [
  { id: 'nd_01', reported_by: 'vic2', need_type: 'rescue', urgency_level: 95, urgency_label: 'critical', people_affected: 4, description: 'Trapped on terrace, water level rising rapidly. 2 children with me.', location: { lat: 22.6856, lng: 75.8234 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_02', reported_by: 'vic3', need_type: 'medical', urgency_level: 90, urgency_label: 'critical', people_affected: 1, description: 'Elderly patient with high fever and respiratory distress. Need immediate med-evac.', location: { lat: 22.7535, lng: 75.8447 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_03', reported_by: 'vic4', need_type: 'food', urgency_level: 60, urgency_label: 'medium', people_affected: 12, description: 'Relief camp low on rations. No food for 24 hours.', location: { lat: 22.6828, lng: 75.8340 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_04', reported_by: 'vic5', need_type: 'water', urgency_level: 80, urgency_label: 'high', people_affected: 50, description: 'Contaminated water source in local shelter. Outbreak risk high.', location: { lat: 22.6811, lng: 75.8474 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_05', reported_by: 'vic6', need_type: 'medical', urgency_level: 70, urgency_label: 'high', people_affected: 2, description: 'Injuries from collapsed structure. Need trauma supplies.', location: { lat: 22.7504, lng: 75.8878 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_06', reported_by: 'vic7', need_type: 'rescue', urgency_level: 85, urgency_label: 'high', people_affected: 3, description: 'Small boat capsized. People holding onto debris in Narmada current.', location: { lat: 22.7118, lng: 75.8620 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_07', reported_by: 'vic8', need_type: 'shelter', urgency_level: 50, urgency_label: 'low', people_affected: 5, description: 'House collapsed. Need temporary tent and blankets.', location: { lat: 22.6973, lng: 75.8843 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_08', reported_by: 'vic9', need_type: 'medical', urgency_level: 95, urgency_label: 'critical', people_affected: 1, description: 'Snake bite victim. Need anti-venom immediately.', location: { lat: 22.6900, lng: 75.8436 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_09', reported_by: 'vic10', need_type: 'food', urgency_level: 75, urgency_label: 'high', people_affected: 8, description: 'Isolated family, both elderly. Running out of drinking water and dry food.', location: { lat: 22.7318, lng: 75.8737 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_10', reported_by: 'vic11', need_type: 'medical', urgency_level: 40, urgency_label: 'low', people_affected: 3, description: 'Basic medications for chronic conditions needed.', location: { lat: 22.7497, lng: 75.8351 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_11', reported_by: 'vic12', need_type: 'rescue', urgency_level: 100, urgency_label: 'critical', people_affected: 2, description: 'Electrical short circuit in waist-high water. Urgent extraction.', location: { lat: 22.7200, lng: 75.8997 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_12', reported_by: 'vic13', need_type: 'food', urgency_level: 30, urgency_label: 'low', people_affected: 15, description: 'Community shelter request for extra blankets and milk powder.', location: { lat: 22.7540, lng: 75.8771 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_13', reported_by: 'vic14', need_type: 'medical', urgency_level: 70, urgency_label: 'high', people_affected: 2, description: 'Diarrheal outbreak in temporary camp. Need rehydration salts.', location: { lat: 22.7321, lng: 75.8979 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_14', reported_by: 'vic15', need_type: 'water', urgency_level: 60, urgency_label: 'medium', people_affected: 10, description: 'Need clean drinking water barrels.', location: { lat: 22.7179, lng: 75.8252 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_15', reported_by: 'vic16', need_type: 'rescue', urgency_level: 80, urgency_label: 'high', people_affected: 6, description: 'Vehicle stranded in flood water at Narengi road.', location: { lat: 22.7467, lng: 75.8442 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_16', reported_by: 'vic17', need_type: 'medical', urgency_level: 90, urgency_label: 'critical', people_affected: 1, description: 'Chest pain, suspected cardiac arrest. Need ambulance dispatch.', location: { lat: 22.6811, lng: 75.8889 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_17', reported_by: 'vic18', need_type: 'shelter', urgency_level: 45, urgency_label: 'medium', people_affected: 4, description: 'Looking for nearest NDRS authorized relief camp.', location: { lat: 22.7527, lng: 75.8497 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_18', reported_by: 'vic19', need_type: 'food', urgency_level: 55, urgency_label: 'medium', people_affected: 20, description: 'Infant formula shortage at Chandmari relief center.', location: { lat: 22.6921, lng: 75.8400 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_19', reported_by: 'vic20', need_type: 'medical', urgency_level: 85, urgency_label: 'high', people_affected: 1, description: 'Pregnant woman in labor. Need transport to Dispur Hospital.', location: { lat: 22.7422, lng: 75.8807 }, status: 'pending', created_at: new Date().toISOString() },
  { id: 'nd_20', reported_by: 'vic21', need_type: 'rescue', urgency_level: 70, urgency_label: 'high', people_affected: 2, description: 'Stranded in forest area near hilly terrain during landslide risk.', location: { lat: 22.7450, lng: 75.8470 }, status: 'pending', created_at: new Date().toISOString() },
];

// ─────────────────────────────────────────────────────────────────────────────
// HISTORICAL DISASTER SCENARIOS
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_SCENARIOS: Scenario[] = [
  {
    id: "bhopal_gas_tragedy_1984",
    name: "Bhopal Gas Tragedy (1984) ☠️",
    description: "World's worst industrial disaster. 45 tons of MIC gas leak from Union Carbide plant.",
    disasterType: "industrial",
    severity: "critical",
    affectedPeople: 500000,
    location: { lat: 23.2847, lng: 77.4103, radius: 20 },
    weatherCondition: { rainfall: 0, windSpeed: 5, temperature: 14 },
    timeline: [
      { minute: 0, event: "9:30 PM: Pipe cleaning begins at MIC plant", requestCount: 0 },
      { minute: 60, event: "11:30 PM: MIC leak detected; ocular irritation reported", requestCount: 15 },
      { minute: 90, event: "Midnight: Exothermic reaction in Tank E610; gas released", requestCount: 850 },
      { minute: 120, event: "00:30 AM: Gas cloud blankets 20 sq km; mass pulmonary edema", requestCount: 2200 },
      { minute: 180, event: "01:30 AM: Factory siren silent; panic in nearby colonies", requestCount: 5000 },
    ],
    requestTemplates: [
      { need: "medical", people: 1, urgency: "critical", location: [23.2847, 77.4103] },
      { need: "rescue", people: 4, urgency: "critical", location: [23.2850, 77.4110] },
      { need: "water", people: 10, urgency: "high", location: [23.2800, 77.4000] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS },
    historicalStats: {
      deaths: 16000,
      injured: 550000,
      responseLag: "12 hours",
      economicLoss: "₹15,000 Cr"
    },
    aiTacticalNodes: [
      {
        id: "bhopal_t60",
        minute: 60,
        category: "evacuation",
        suggestion: "Broadcast immediate area-wide evacuation via public sirens and radio.",
        historicalReality: "The factory's siren was not sounded to avoid alarming the neighborhood.",
        predictedImpact: "Estimated 40% reduction in initial inhalation fatalities.",
        impactWeight: 0.4
      },
      {
        id: "bhopal_t120",
        minute: 120,
        category: "medical",
        suggestion: "Release stockpile of Sodium Thiosulphate antidotes to local clinics.",
        historicalReality: "Antidotal treatment was delayed due to lack of MIC toxicity data disclosure.",
        predictedImpact: "Estimated 25% reduction in long-term respiratory failure cases.",
        impactWeight: 0.25
      }
    ]
  },
  {
    id: "bhuj_earthquake_2001",
    name: "Bhuj Earthquake (2001) 🏗️",
    description: "M7.6 Republic Day earthquake. Massive structural collapse across Kutch.",
    disasterType: "earthquake",
    severity: "critical",
    affectedPeople: 1000000,
    location: { lat: 23.3343, lng: 70.3644, radius: 50 },
    weatherCondition: { rainfall: 0, windSpeed: 10, temperature: 18 },
    timeline: [
      { minute: 0, event: "08:46 AM: Main shock (M7.6) hits during Republic Day parade", requestCount: 0 },
      { minute: 5, event: "Massive structural collapse in Bhuj, Anjar, Bhachau", requestCount: 500 },
      { minute: 15, event: "Communication & power lines severed across Gujarat", requestCount: 1200 },
      { minute: 120, event: "Army mobilizes; 'Operation Sahayata' launched", requestCount: 4500 },
    ],
    requestTemplates: [
      { need: "rescue", people: 5, urgency: "critical", location: [23.3343, 70.3644] },
      { need: "medical", people: 2, urgency: "critical", location: [23.3300, 70.3600] },
      { need: "shelter", people: 20, urgency: "high", location: [23.3400, 70.3700] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS },
    historicalStats: {
      deaths: 20023,
      injured: 166835,
      responseLag: "8 hours",
      economicLoss: "₹21,000 Cr"
    },
    aiTacticalNodes: [
      {
        id: "bhuj_t5",
        minute: 5,
        category: "rescue",
        suggestion: "Deploy advanced K-9 search units and acoustic sensors to Bhachau city center.",
        historicalReality: "Local villagers engaged in manual shoveling for over 15 hours before equipment arrived.",
        predictedImpact: "Estimated 15% improvement in 'Golden Hour' live extraction rate.",
        impactWeight: 0.15
      }
    ]
  },
  {
    id: "kedarnath_floods_2013",
    name: "Kedarnath 'Tsunami' (2013) 🌊",
    description: "Himalayan cloudburst triggers Chorabari Lake breach and massive flash flood.",
    disasterType: "flash_flood",
    severity: "critical",
    affectedPeople: 100000,
    location: { lat: 30.7352, lng: 79.0669, radius: 10 },
    weatherCondition: { rainfall: 315, windSpeed: 45, temperature: 4 },
    timeline: [
      { minute: 0, event: "June 16, 20:00: Chorabari glacier melt peaks", requestCount: 0 },
      { minute: 60, event: "June 16, 21:00: Rambara town completely washed away", requestCount: 150 },
      { minute: 600, event: "June 17, 06:45: Chorabari Lake breach; mass water release", requestCount: 800 },
      { minute: 660, event: "June 17, 07:45: 50ft water wall hits Kedarnath temple city", requestCount: 1500 },
    ],
    requestTemplates: [
      { need: "rescue", people: 10, urgency: "critical", location: [30.7352, 79.0669] },
      { need: "food", people: 50, urgency: "high", location: [30.7300, 79.0600] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS },
    historicalStats: {
      deaths: 5748,
      injured: 12000,
      responseLag: "24 hours",
      economicLoss: "₹4,500 Cr"
    },
    aiTacticalNodes: [
      {
        id: "keda_t600",
        minute: 600,
        category: "evacuation",
        suggestion: "Immediate vertical evacuation of all pilgrims to Kedarnath temple terrace and upper levels.",
        historicalReality: "Pilgrims were caught in the ground-level torrent while attempting to flee via valley paths.",
        predictedImpact: "Estimated 30% reduction in flash-flood related fatalities.",
        impactWeight: 0.3
      }
    ]
  },
  {
    id: "kerala_floods_2018",
    name: "Kerala Century Flood (2018) 🚣",
    description: "Unprecedented monsoon leads to simultaneous opening of 35 major dams.",
    disasterType: "flood",
    severity: "critical",
    affectedPeople: 1400000,
    location: { lat: 10.0159, lng: 76.3419, radius: 80 },
    weatherCondition: { rainfall: 164, windSpeed: 38, temperature: 27 },
    timeline: [
      { minute: 0, event: "Aug 14: Critical rain phase; state on red alert", requestCount: 0 },
      { minute: 1440, event: "Aug 15: 35 dams opened simultaneously; 'Operation Madad' begins", requestCount: 2100 },
      { minute: 2880, event: "Aug 16: Peak flooding; 1.4 million people displaced", requestCount: 5500 },
    ],
    requestTemplates: [
      { need: "rescue", people: 12, urgency: "critical", location: [10.0159, 76.3419] },
      { need: "food", people: 100, urgency: "high", location: [10.0000, 76.3000] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS },
    historicalStats: {
      deaths: 483,
      injured: 140,
      responseLag: "6 hours",
      economicLoss: "₹31,000 Cr"
    },
    aiTacticalNodes: [
      {
        id: "kera_t0",
        minute: 0,
        category: "logistics",
        suggestion: "Pre-emptive controlled dam release at 15% capacity to prevent total peak breach.",
        historicalReality: "Officials were forced to open 35 floodgates simultaneously for the first time in history.",
        predictedImpact: "Estimated 20% reduction in downstream urban flood velocity.",
        impactWeight: 0.2
      }
    ]
  },
  {
    id: "latur_earthquake_1993",
    name: "Latur Earthquake (1993) 🏚️",
    description: "M6.2 intraplate earthquake in Maharashtra. Epicenter at Killari.",
    disasterType: "earthquake",
    severity: "high",
    affectedPeople: 100000,
    location: { lat: 18.2392, lng: 76.5861, radius: 30 },
    weatherCondition: { rainfall: 0, windSpeed: 8, temperature: 22 },
    timeline: [
      { minute: 0, event: "03:56 AM: Main shock strikes while villages sleep", requestCount: 0 },
      { minute: 1, event: "Killari and 52 villages flattened instantly", requestCount: 800 },
      { minute: 60, event: "05:00 AM: First responders find 10k dead across ruins", requestCount: 2500 },
    ],
    requestTemplates: [
      { need: "rescue", people: 8, urgency: "critical", location: [18.2392, 76.5861] },
      { need: "medical", people: 10, urgency: "critical", location: [18.2300, 76.5800] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS }
  },
  {
    id: "odisha_super_cyclone_1999",
    name: "Odisha 'Deadly' Super Cyclone (1999) 🌪️",
    description: "260km/h winds hit Paradip. Quasi-stationary for 30 hours over coast.",
    disasterType: "cyclone",
    severity: "critical",
    affectedPeople: 15000000,
    location: { lat: 20.1764, lng: 86.4326, radius: 100 },
    weatherCondition: { rainfall: 445, windSpeed: 260, temperature: 24 },
    timeline: [
      { minute: 0, event: "Oct 29, 11:30 AM: Landfall at Paradip with 260km/h winds", requestCount: 0 },
      { minute: 60, event: "8-meter storm surge wipes out Ersama coast", requestCount: 5000 },
      { minute: 1800, event: "30 hours stationary over coast; extreme flooding", requestCount: 12000 },
    ],
    requestTemplates: [
      { need: "rescue", people: 50, urgency: "critical", location: [20.1764, 86.4326] },
      { need: "food", people: 1000, urgency: "high", location: [20.2000, 86.5000] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS }
  },
  {
    id: "cyclone_fani_2019",
    name: "Cyclone Fani (2019) 🌀",
    description: "Extremely Severe Cyclonic Storm. Mass evacuation of 1.2M in 24h.",
    disasterType: "cyclone",
    severity: "high",
    affectedPeople: 1200000,
    location: { lat: 19.8135, lng: 85.8312, radius: 40 },
    weatherCondition: { rainfall: 200, windSpeed: 185, temperature: 28 },
    timeline: [
      { minute: 0, event: "May 3, 08:00 AM: Landfall near Puri, Odisha", requestCount: 0 },
      { minute: 120, event: "High-speed winds hit Bhubaneswar and Cuttack", requestCount: 400 },
      { minute: 240, event: "Infrastructure damage assessment; grid failure", requestCount: 1200 },
    ],
    requestTemplates: [
      { need: "shelter", people: 100, urgency: "high", location: [19.8135, 85.8312] },
      { need: "water", people: 500, urgency: "high", location: [19.8000, 85.8000] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS }
  },
  {
    id: "indian_ocean_tsunami_2004",
    name: "Indian Ocean Tsunami (2004) 🌊",
    description: "Mega-tsunami triggered by M9.1 Sumatra earthquake.",
    disasterType: "flood",
    severity: "critical",
    affectedPeople: 16000,
    location: { lat: 11.6234, lng: 92.7265, radius: 100 },
    weatherCondition: { rainfall: 0, windSpeed: 15, temperature: 30 },
    timeline: [
      { minute: 0, event: "07:58 AM: M9.1 Sumatra Earthquake strikes", requestCount: 0 },
      { minute: 15, event: "08:13 AM: Tsunami hits Andaman & Nicobar islands", requestCount: 1200 },
      { minute: 90, event: "09:28 AM: Tsunami hits Tamil Nadu mainland coast", requestCount: 8000 },
      { minute: 120, event: "09:58 AM: 10-meter waves hit Nagapattinam & Cuddalore", requestCount: 15000 },
    ],
    requestTemplates: [
      { need: "medical", people: 20, urgency: "critical", location: [11.6234, 92.7265] },
      { need: "rescue", people: 10, urgency: "critical", location: [10.7672, 79.8444] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS }
  },
  {
    id: "uttarakhand_wildfires_2016",
    name: "Uttarakhand Fires (2016) 🔥",
    description: "Mega-wildfire season destroying 4,500 hectares of forest.",
    disasterType: "industrial",
    severity: "high",
    affectedPeople: 5000,
    location: { lat: 30.0668, lng: 79.0193, radius: 60 },
    weatherCondition: { rainfall: 0, windSpeed: 12, temperature: 42 },
    timeline: [
      { minute: 0, event: "April 24: Fires escalate; local suppression failing", requestCount: 0 },
      { minute: 1440, event: "April 30: 1000+ incidents; NDRF & IAF 'Operation' begins", requestCount: 450 },
      { minute: 5760, event: "May 3: Rain finally aids fire suppression efforts", requestCount: 800 },
    ],
    requestTemplates: [
      { need: "rescue", people: 5, urgency: "critical", location: [30.0668, 79.0193] },
      { need: "medical", people: 2, urgency: "high", location: [30.1000, 79.1000] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS }
  },
  {
    id: "cyclone_amphan_2020",
    name: "Cyclone Amphan (2020) ⛈️",
    description: "Super Cyclone during COVID-19. Devastating Category 4 landfall.",
    disasterType: "cyclone",
    severity: "critical",
    affectedPeople: 10000000,
    location: { lat: 21.6500, lng: 88.2000, radius: 80 },
    weatherCondition: { rainfall: 300, windSpeed: 155, temperature: 27 },
    timeline: [
      { minute: 0, event: "May 20, 14:30: Landfall near Bakkhali, Sundarbans", requestCount: 0 },
      { minute: 240, event: "18:30: 155km/h eye crosses Kolkata; mass destruction", requestCount: 8000 },
      { minute: 720, event: "May 21: Dissipates over Bangladesh; 1M homes damaged", requestCount: 15000 },
    ],
    requestTemplates: [
      { need: "rescue", people: 10, urgency: "critical", location: [21.6500, 88.2000] },
      { need: "shelter", people: 200, urgency: "high", location: [22.5726, 88.3639] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS }
  },
];

export const MOCK_RISK_ZONES: RiskZone[] = [
  {
    id: 'rz_assam_1',
    region: 'Indore Riverside North',
    risk_score: 92,
    risk_level: 'red',
    polygon: [
      { lat: 22.7523, lng: 75.8976 },
      { lat: 22.7325, lng: 75.8855 },
      { lat: 22.7420, lng: 75.8681 },
      { lat: 22.7412, lng: 75.8331 }
    ],
    forecast_time: new Date(Date.now() + 3600000 * 4).toISOString()
  },
  {
     id: 'rz1',
     region: 'South Indore Lowlands',
     risk_score: 75,
     risk_level: 'red',
     polygon: [
       { lat: 22.7189, lng: 75.8936 },
       { lat: 22.7366, lng: 75.8985 },
       { lat: 22.7331, lng: 75.8279 },
       { lat: 22.7056, lng: 75.8345 }
     ],
     forecast_time: new Date(Date.now() + 3600000 * 24).toISOString()
   },
];
