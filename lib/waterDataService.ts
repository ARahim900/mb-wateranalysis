// Water Data Service for Muscat Bay Water Analysis
// Handles data parsing, validation, and processing

// Types for water data structure
export interface WaterDataSummary {
  month: string;
  L1: number;
  L2: number;
  L3: number;
  Stage01Loss: number;
  Stage02Loss: number;
  TotalLoss: number;
}

export interface ZoneBulkMeter {
  month: string;
  Zone01FM: number;
  Zone03A: number;
  Zone03B: number;
  Zone05: number;
  Zone08: number;
  ZoneVS: number;
}

export interface DirectConnection {
  month: string;
  DC: number;
  Irrigation: number;
  DBuildingCommon: number;
  MBCommon: number;
}

export interface MBPayment {
  month: string;
  value: number;
}

export interface WaterData {
  summary: WaterDataSummary[];
  zones: {
    bulkMeters: ZoneBulkMeter[];
    individual: ZoneBulkMeter[];
    loss: ZoneBulkMeter[];
  };
  directConnection: DirectConnection[];
  totalMBToPay: MBPayment[];
}

// Default data to use initially (this will be replaced by parsed data)
export const defaultWaterData: WaterData = {
  summary: [
    { month: "Jan-24", L1: 32803, L2: 28689, L3: 25680, Stage01Loss: 4114, Stage02Loss: 3009, TotalLoss: 7123 },
    { month: "Feb-24", L1: 27996, L2: 25073, L3: 21908, Stage01Loss: 2923, Stage02Loss: 3165, TotalLoss: 6088 },
    { month: "Mar-24", L1: 23860, L2: 24007, L3: 19626, Stage01Loss: -147, Stage02Loss: 4381, TotalLoss: 4234 },
    { month: "Apr-24", L1: 31869, L2: 28713, L3: 23584, Stage01Loss: 3156, Stage02Loss: 5129, TotalLoss: 8285 },
    { month: "May-24", L1: 30737, L2: 28089, L3: 23692, Stage01Loss: 2648, Stage02Loss: 4397, TotalLoss: 7045 },
    { month: "Jun-24", L1: 41953, L2: 34626, L3: 27865, Stage01Loss: 7327, Stage02Loss: 6761, TotalLoss: 14088 },
    { month: "Jul-24", L1: 35166, L2: 34689, L3: 25961, Stage01Loss: 477, Stage02Loss: 8728, TotalLoss: 9205 },
    { month: "Aug-24", L1: 35420, L2: 32753, L3: 25246, Stage01Loss: 2667, Stage02Loss: 7507, TotalLoss: 10174 },
    { month: "Sep-24", L1: 41341, L2: 30892, L3: 23744, Stage01Loss: 10449, Stage02Loss: 7148, TotalLoss: 17597 },
    { month: "Oct-24", L1: 31519, L2: 39285, L3: 30881, Stage01Loss: -7766, Stage02Loss: 8404, TotalLoss: 637 },
    { month: "Nov-24", L1: 35290, L2: 29913, L3: 24719, Stage01Loss: 5377, Stage02Loss: 5194, TotalLoss: 10571 },
    { month: "Dec-24", L1: 36733, L2: 32492, L3: 24545, Stage01Loss: 4241, Stage02Loss: 7947, TotalLoss: 12188 },
    { month: "Jan-25", L1: 32580, L2: 35325, L3: 27898, Stage01Loss: -2745, Stage02Loss: 7427, TotalLoss: 4682 },
    { month: "Feb-25", L1: 44043, L2: 35811, L3: 28369, Stage01Loss: 8232, Stage02Loss: 7442, TotalLoss: 15674 },
    { month: "Mar-25", L1: 34915, L2: 39565, L3: 32264, Stage01Loss: -4650, Stage02Loss: 7301, TotalLoss: 2651 },
  ],
  zones: {
    bulkMeters: [
      { month: "Jan-24", Zone01FM: 1595, Zone03A: 1234, Zone03B: 2653, Zone05: 4286, Zone08: 2170, ZoneVS: 26 },
      { month: "Feb-24", Zone01FM: 1283, Zone03A: 1099, Zone03B: 2169, Zone05: 3897, Zone08: 1825, ZoneVS: 19 },
      { month: "Mar-24", Zone01FM: 1255, Zone03A: 1297, Zone03B: 2315, Zone05: 4127, Zone08: 2021, ZoneVS: 72 },
      { month: "Apr-24", Zone01FM: 1383, Zone03A: 1892, Zone03B: 2381, Zone05: 4911, Zone08: 2753, ZoneVS: 60 },
      { month: "May-24", Zone01FM: 1411, Zone03A: 2254, Zone03B: 2634, Zone05: 2639, Zone08: 2722, ZoneVS: 125 },
      { month: "Jun-24", Zone01FM: 2078, Zone03A: 2227, Zone03B: 2932, Zone05: 4992, Zone08: 3193, ZoneVS: 277 },
      { month: "Jul-24", Zone01FM: 2601, Zone03A: 3313, Zone03B: 3369, Zone05: 5305, Zone08: 3639, ZoneVS: 143 },
      { month: "Aug-24", Zone01FM: 1638, Zone03A: 3172, Zone03B: 3458, Zone05: 4039, Zone08: 3957, ZoneVS: 137 },
      { month: "Sep-24", Zone01FM: 1550, Zone03A: 2698, Zone03B: 3742, Zone05: 2736, Zone08: 3947, ZoneVS: 145 },
      { month: "Oct-24", Zone01FM: 2098, Zone03A: 3715, Zone03B: 2906, Zone05: 3383, Zone08: 4296, ZoneVS: 63 },
      { month: "Nov-24", Zone01FM: 1808, Zone03A: 3501, Zone03B: 2695, Zone05: 1438, Zone08: 3569, ZoneVS: 34 },
      { month: "Dec-24", Zone01FM: 1946, Zone03A: 3796, Zone03B: 3583, Zone05: 3788, Zone08: 3018, ZoneVS: 17 },
      { month: "Jan-25", Zone01FM: 2008, Zone03A: 4235, Zone03B: 3256, Zone05: 4267, Zone08: 1547, ZoneVS: 14 },
      { month: "Feb-25", Zone01FM: 1740, Zone03A: 4273, Zone03B: 2962, Zone05: 4231, Zone08: 1498, ZoneVS: 12 },
      { month: "Mar-25", Zone01FM: 1880, Zone03A: 3591, Zone03B: 3331, Zone05: 3862, Zone08: 2605, ZoneVS: 21 },
    ],
    individual: [
      { month: "Jan-24", Zone01FM: 1746, Zone03A: 1387, Zone03B: 1664, Zone05: 2172, Zone08: 1986, ZoneVS: 0 },
      { month: "Feb-24", Zone01FM: 1225, Zone03A: 1268, Zone03B: 1443, Zone05: 1623, Zone08: 1560, ZoneVS: 11 },
      { month: "Mar-24", Zone01FM: 1194, Zone03A: 1179, Zone03B: 1536, Zone05: 1032, Zone08: 1749, ZoneVS: 65 },
      { month: "Apr-24", Zone01FM: 1316, Zone03A: 1179, Zone03B: 1555, Zone05: 1553, Zone08: 2597, ZoneVS: 32 },
      { month: "May-24", Zone01FM: 1295, Zone03A: 1348, Zone03B: 1552, Zone05: 788, Zone08: 2372, ZoneVS: 19 },
      { month: "Jun-24", Zone01FM: 1909, Zone03A: 1177, Zone03B: 1669, Zone05: 1274, Zone08: 2718, ZoneVS: 148 },
      { month: "Jul-24", Zone01FM: 2369, Zone03A: 1172, Zone03B: 1781, Zone05: 1861, Zone08: 2311, ZoneVS: 119 },
      { month: "Aug-24", Zone01FM: 1619, Zone03A: 1473, Zone03B: 1643, Zone05: 1137, Zone08: 2896, ZoneVS: 134 },
      { month: "Sep-24", Zone01FM: 1425, Zone03A: 1264, Zone03B: 1496, Zone05: 858, Zone08: 2493, ZoneVS: 46 },
      { month: "Oct-24", Zone01FM: 1485, Zone03A: 1657, Zone03B: 1789, Zone05: 1100, Zone08: 1977, ZoneVS: 54 },
      { month: "Nov-24", Zone01FM: 1756, Zone03A: 1560, Zone03B: 1423, Zone05: 1057, Zone08: 2070, ZoneVS: 34 },
      { month: "Dec-24", Zone01FM: 1975, Zone03A: 1475, Zone03B: 1883, Zone05: 1154, Zone08: 1680, ZoneVS: 35 },
      { month: "Jan-25", Zone01FM: 2062, Zone03A: 1359, Zone03B: 1713, Zone05: 1254, Zone08: 1477, ZoneVS: 25 },
      { month: "Feb-25", Zone01FM: 1832, Zone03A: 1349, Zone03B: 1451, Zone05: 1233, Zone08: 1379, ZoneVS: 30 },
      { month: "Mar-25", Zone01FM: 1817, Zone03A: 1129, Zone03B: 1470, Zone05: 1184, Zone08: 2356, ZoneVS: 0 },
    ],
    loss: [
      { month: "Jan-24", Zone01FM: -151, Zone03A: -153, Zone03B: 989, Zone05: 2114, Zone08: 184, ZoneVS: 26 },
      { month: "Feb-24", Zone01FM: 58, Zone03A: -169, Zone03B: 726, Zone05: 2274, Zone08: 265, ZoneVS: 8 },
      { month: "Mar-24", Zone01FM: 61, Zone03A: 118, Zone03B: 779, Zone05: 3095, Zone08: 272, ZoneVS: 7 },
      { month: "Apr-24", Zone01FM: 67, Zone03A: 713, Zone03B: 826, Zone05: 3358, Zone08: 156, ZoneVS: 28 },
      { month: "May-24", Zone01FM: 116, Zone03A: 906, Zone03B: 1082, Zone05: 1851, Zone08: 350, ZoneVS: 106 },
      { month: "Jun-24", Zone01FM: 169, Zone03A: 1050, Zone03B: 1263, Zone05: 3718, Zone08: 475, ZoneVS: 129 },
      { month: "Jul-24", Zone01FM: 232, Zone03A: 2141, Zone03B: 1588, Zone05: 3444, Zone08: 1328, ZoneVS: 24 },
      { month: "Aug-24", Zone01FM: 19, Zone03A: 1699, Zone03B: 1815, Zone05: 2902, Zone08: 1061, ZoneVS: 3 },
      { month: "Sep-24", Zone01FM: 125, Zone03A: 1434, Zone03B: 2246, Zone05: 1878, Zone08: 1454, ZoneVS: 99 },
      { month: "Oct-24", Zone01FM: 613, Zone03A: 2058, Zone03B: 1117, Zone05: 2283, Zone08: 2319, ZoneVS: 9 },
      { month: "Nov-24", Zone01FM: 52, Zone03A: 1941, Zone03B: 1272, Zone05: 381, Zone08: 1499, ZoneVS: 0 },
      { month: "Dec-24", Zone01FM: -29, Zone03A: 2321, Zone03B: 1700, Zone05: 2634, Zone08: 1338, ZoneVS: -18 },
      { month: "Jan-25", Zone01FM: -54, Zone03A: 2876, Zone03B: 1543, Zone05: 3013, Zone08: 70, ZoneVS: -11 },
      { month: "Feb-25", Zone01FM: -92, Zone03A: 2924, Zone03B: 1511, Zone05: 2998, Zone08: 119, ZoneVS: -18 },
      { month: "Mar-25", Zone01FM: 63, Zone03A: 2462, Zone03B: 1861, Zone05: 2678, Zone08: 249, ZoneVS: 21 },
    ],
  },
  directConnection: [
    { month: "Jan-24", DC: 16725, Irrigation: 2535, DBuildingCommon: 178, MBCommon: 312 },
    { month: "Feb-24", DC: 14718, Irrigation: 2765, DBuildingCommon: 69, MBCommon: 330 },
    { month: "Mar-24", DC: 12920, Irrigation: 2157, DBuildingCommon: 343, MBCommon: 260 },
    { month: "Apr-24", DC: 15333, Irrigation: 2798, DBuildingCommon: 266, MBCommon: 240 },
    { month: "May-24", DC: 16304, Irrigation: 2211, DBuildingCommon: 162, MBCommon: 197 },
    { month: "Jun-24", DC: 18927, Irrigation: 4463, DBuildingCommon: 419, MBCommon: 259 },
    { month: "Jul-24", DC: 16319, Irrigation: 5225, DBuildingCommon: 123, MBCommon: 213 },
    { month: "Aug-24", DC: 16352, Irrigation: 2632, DBuildingCommon: 722, MBCommon: 146 },
    { month: "Sep-24", DC: 16074, Irrigation: 3024, DBuildingCommon: 0, MBCommon: 147 },
    { month: "Oct-24", DC: 22824, Irrigation: 2793, DBuildingCommon: 217, MBCommon: 169 },
    { month: "Nov-24", DC: 16868, Irrigation: 3326, DBuildingCommon: 183, MBCommon: 188 },
    { month: "Dec-24", DC: 16344, Irrigation: 2950, DBuildingCommon: 6, MBCommon: 325 },
    { month: "Jan-25", DC: 19998, Irrigation: 5208, DBuildingCommon: 17, MBCommon: 341 },
    { month: "Feb-25", DC: 21095, Irrigation: 5863, DBuildingCommon: 252, MBCommon: 202 },
    { month: "Mar-25", DC: 24275, Irrigation: 6326, DBuildingCommon: 36, MBCommon: 202 },
  ],
  totalMBToPay: [
    { month: "Jan-24", value: 4190 },
    { month: "Feb-24", value: 3164 },
    { month: "Mar-24", value: 2760 },
    { month: "Apr-24", value: 3304 },
    { month: "May-24", value: 2570 },
    { month: "Jun-24", value: 5141 },
    { month: "Jul-24", value: 5561 },
    { month: "Aug-24", value: 3500 },
    { month: "Sep-24", value: 3171 },
    { month: "Oct-24", value: 3179 },
    { month: "Nov-24", value: 3697 },
    { month: "Dec-24", value: 3281 },
    { month: "Jan-25", value: 5566 },
    { month: "Feb-25", value: 6317 },
    { month: "Mar-25", value: 6564 },
  ],
};

// Parse the input data from paste.txt or CSV file
export async function parseWaterData(file: File): Promise<WaterData> {
  try {
    const text = await file.text();
    const lines = text.split('\n');
    
    // Initialize data structures
    const parsedData: WaterData = structuredClone(defaultWaterData);
    
    // Process the input data
    // This is a placeholder - you'll need to adapt this based on your paste.txt format
    // Extract relevant fields, calculate sums, etc.
    
    // Example: Process direct connection data
    // Find irrigation components
    const irrigationLines = lines.filter(line => 
      line.includes('IRR_Services') || 
      line.includes('Irrigation Tank') || 
      line.includes('Irrigation- Controller')
    );
    
    // Find Building Common components
    const buildingCommonLines = lines.filter(line => 
      line.includes('MB_Common') || 
      line.includes('Sales Center Common') || 
      line.includes('Building (Security)') ||
      line.includes('Building (ROP)') ||
      line.includes('Community Mgmt') ||
      line.includes('PHASE 02, MAIN ENTRANCE')
    );
    
    // Example: Calculate sum for irrigation for Jan-24
    if (irrigationLines.length > 0) {
      // Extract and sum values for Jan-24
      // This is a simplified example - you'll need to adapt to your specific data format
      const jan24Sum = irrigationLines
        .filter(line => line.includes('Jan-24'))
        .reduce((sum, line) => {
          const match = line.match(/\d+/);
          return sum + (match ? parseInt(match[0]) : 0);
        }, 0);
      
      // Update the Jan-24 irrigation value
      const janIndex = parsedData.directConnection.findIndex(item => item.month === 'Jan-24');
      if (janIndex >= 0) {
        parsedData.directConnection[janIndex].Irrigation = jan24Sum;
      }
    }
    
    // Calculate loss values correctly
    parsedData.summary.forEach((month, index) => {
      // Stage01Loss = L1 - L2
      month.Stage01Loss = month.L1 - month.L2;
      
      // Stage02Loss = L2 - L3
      month.Stage02Loss = month.L2 - month.L3;
      
      // TotalLoss = Stage01Loss + Stage02Loss
      month.TotalLoss = month.Stage01Loss + month.Stage02Loss;
    });
    
    // Calculate zone losses
    parsedData.zones.bulkMeters.forEach((bulkMonth, index) => {
      const individualMonth = parsedData.zones.individual[index];
      const lossMonth = parsedData.zones.loss[index];
      
      // For each zone, loss = bulk - individual
      lossMonth.Zone01FM = bulkMonth.Zone01FM - individualMonth.Zone01FM;
      lossMonth.Zone03A = bulkMonth.Zone03A - individualMonth.Zone03A;
      lossMonth.Zone03B = bulkMonth.Zone03B - individualMonth.Zone03B;
      lossMonth.Zone05 = bulkMonth.Zone05 - individualMonth.Zone05;
      lossMonth.Zone08 = bulkMonth.Zone08 - individualMonth.Zone08;
      lossMonth.ZoneVS = bulkMonth.ZoneVS - individualMonth.ZoneVS;
    });
    
    // Return processed data
    return parsedData;
  } catch (error) {
    console.error('Error parsing water data:', error);
    return defaultWaterData;
  }
}

// Validate data consistency
export function validateWaterData(data: WaterData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check that L1 - L2 = Stage01Loss
  data.summary.forEach(month => {
    const calculatedStage01Loss = month.L1 - month.L2;
    if (Math.abs(calculatedStage01Loss - month.Stage01Loss) > 0.1) {
      errors.push(`${month.month}: Stage01Loss (${month.Stage01Loss}) doesn't match L1-L2 (${calculatedStage01Loss})`);
    }
    
    const calculatedStage02Loss = month.L2 - month.L3;
    if (Math.abs(calculatedStage02Loss - month.Stage02Loss) > 0.1) {
      errors.push(`${month.month}: Stage02Loss (${month.Stage02Loss}) doesn't match L2-L3 (${calculatedStage02Loss})`);
    }
    
    const calculatedTotalLoss = month.Stage01Loss + month.Stage02Loss;
    if (Math.abs(calculatedTotalLoss - month.TotalLoss) > 0.1) {
      errors.push(`${month.month}: TotalLoss (${month.TotalLoss}) doesn't match Stage01Loss+Stage02Loss (${calculatedTotalLoss})`);
    }
  });
  
  // Validate zone losses
  data.zones.bulkMeters.forEach((bulkMonth, index) => {
    const individualMonth = data.zones.individual[index];
    const lossMonth = data.zones.loss[index];
    const monthName = bulkMonth.month;
    
    const zones = ['Zone01FM', 'Zone03A', 'Zone03B', 'Zone05', 'Zone08', 'ZoneVS'] as const;
    
    zones.forEach(zone => {
      const calculatedLoss = bulkMonth[zone] - individualMonth[zone];
      if (Math.abs(calculatedLoss - lossMonth[zone]) > 0.1) {
        errors.push(`${monthName} ${zone}: Loss (${lossMonth[zone]}) doesn't match Bulk-Individual (${calculatedLoss})`);
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
