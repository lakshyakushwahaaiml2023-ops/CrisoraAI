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
    id: "monsoon_guwahati_2026",
    name: "Monsoon Flood Crisis – Indore City",
    description: "Narmada river crosses the danger level by 3.2 meters, causing flash floods and urban landslides across Indore City city.",
    disasterType: "flood",
    severity: "high",
    affectedPeople: 45000,
    location: { lat: 22.7443, lng: 75.8377, radius: 20 },
    weatherCondition: { rainfall: 145, windSpeed: 22, temperature: 26 },
    timeline: [
      { minute: 0, event: "Rainfall exceeds 100mm in 2 hours — Flash flood alert", requestCount: 0 },
      { minute: 15, event: "Narmada breaches embankments at Indore City Ghat", requestCount: 45 },
      { minute: 30, event: "Power outages reported in 60% of metro area", requestCount: 120 },
      { minute: 60, event: "NDRF & SDMA joint command station established", requestCount: 250 },
      { minute: 120, event: "Rescue ops ongoing — boats deployed at Narengi & Zoo Road", requestCount: 410 },
    ],
    requestTemplates: [
      { need: "rescue", people: 4, urgency: "critical", location: [26.12, 91.71] },
      { need: "medical", people: 1, urgency: "critical", location: [26.13, 91.72] },
      { need: "food", people: 12, urgency: "medium", location: [26.11, 91.70] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS }
  },
  {
    id: "monsoon_jaipur_2025",
    name: "Monsoon Flash Flood – Indore",
    description: "Heavy rainfall triggers a devastating flash flood across low-lying areas of Indore, displacing thousands.",
    disasterType: "flood",
    severity: "high",
    affectedPeople: 2147,
    location: { lat: 22.7412, lng: 75.8432, radius: 15 },
    weatherCondition: { rainfall: 87, windSpeed: 25, temperature: 28 },
    timeline: [
      { minute: 0, event: "Heavy rainfall begins — IMD issues yellow alert", requestCount: 0 },
      { minute: 5, event: "Reports of water rising in Mansarovar colony", requestCount: 12 },
      { minute: 15, event: "Evacuation alerts issued for 3 sub-districts", requestCount: 45 },
      { minute: 25, event: "Bridge at Durgapura collapses — road blocked", requestCount: 68 },
      { minute: 30, event: "Water levels peak — NDRF deployed", requestCount: 87 },
      { minute: 45, event: "Rescue ops begin — 12 boats operational", requestCount: 103 },
      { minute: 60, event: "Rainfall decreases — relief camps open", requestCount: 124 },
      { minute: 75, event: "Power outages in 6 wards — hospitals on generator", requestCount: 139 },
      { minute: 90, event: "Situation stabilizing — 800 evacuated", requestCount: 147 },
    ],
    requestTemplates: [
      { need: "shelter", people: 8, urgency: "high", location: [26.91, 75.78] },
      { need: "food", people: 15, urgency: "medium", location: [26.92, 75.79] },
      { need: "medical", people: 2, urgency: "critical", location: [26.90, 75.78] },
      { need: "rescue", people: 5, urgency: "critical", location: [26.89, 75.77] },
      { need: "water", people: 20, urgency: "high", location: [26.93, 75.80] },
    ],
    availableResources: { volunteers: MOCK_VOLUNTEERS, ngos: MOCK_NGOS }
  },
  {
    id: "kerala_floods_2018",
    name: "Kerala Floods 2018",
    description: "Worst flood in Kerala in nearly a century. All 14 districts affected. 483 dead, 1.4M displaced.",
    disasterType: "flood",
    severity: "critical",
    affectedPeople: 1400000,
    location: { lat: 22.7261, lng: 75.8954, radius: 80 },
    weatherCondition: { rainfall: 164, windSpeed: 38, temperature: 27 },
    timeline: [
      { minute: 0, event: "Red alert issued across all 14 districts — Aug 8, 2018", requestCount: 0 },
      { minute: 60, event: "Navy, Air Force, NDRF mobilize — 58 helicopters airborne", requestCount: 2100 },
    ],
    requestTemplates: [
      { need: "rescue", people: 12, urgency: "critical", location: [10.10, 76.35] },
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
