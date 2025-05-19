"use client"

import { useState, useEffect } from "react"

// Define the types for our data
interface ElectricityData {
  name: string
  type: string
  meterAccountNo: string
  monthlyConsumption: { month: string; value: number }[]
  totalConsumption: number
  averageConsumption: number
  totalCost: number
  averageCost: number
}

interface MonthlyData {
  name: string
  type: string
  meterAccountNo: string
  consumption: number
  cost: number
}

interface ConsumptionByType {
  type: string
  consumption: number
  cost: number
}

interface MonthlyTrend {
  month: string
  consumption: number
  cost: number
}

interface TotalStats {
  totalConsumption: number
  totalCost: number
  averageMonthlyConsumption: number
  averageMonthlyConsumption: number
}

// Raw data from the database
const rawData = [
  {
    name: "Pumping Station 01",
    type: "PS",
    meterAccountNo: "R52330",
    "Apr-24": 1608,
    "May-24": 1940,
    "Jun-24": 1783,
    "Jul-24": 1874,
    "Aug-24": 1662,
    "Sep-24": 3822,
    "Oct-24": 6876,
    "Nov-24": 1629,
    "Dec-24": 1640,
    "Jan-25": 1903,
    "Feb-25": 2095,
    "Mar-25": 3032,
  },
  {
    name: "Pumping Station 03",
    type: "PS",
    meterAccountNo: "R52329",
    "Apr-24": 31,
    "May-24": 47,
    "Jun-24": 25,
    "Jul-24": 3,
    "Aug-24": 0,
    "Sep-24": 0,
    "Oct-24": 33,
    "Nov-24": 0,
    "Dec-24": 179,
    "Jan-25": 33,
    "Feb-25": 137,
    "Mar-25": 131,
  },
  {
    name: "Pumping Station 04",
    type: "PS",
    meterAccountNo: "R52327",
    "Apr-24": 830,
    "May-24": 818,
    "Jun-24": 720,
    "Jul-24": 731,
    "Aug-24": 857,
    "Sep-24": 1176,
    "Oct-24": 445,
    "Nov-24": 919,
    "Dec-24": 921,
    "Jan-25": 245,
    "Feb-25": 870,
    "Mar-25": 646,
  },
  {
    name: "Pumping Station 05",
    type: "PS",
    meterAccountNo: "R52325",
    "Apr-24": 1774,
    "May-24": 2216,
    "Jun-24": 2011,
    "Jul-24": 2059,
    "Aug-24": 2229,
    "Sep-24": 5217,
    "Oct-24": 2483,
    "Nov-24": 2599,
    "Dec-24": 1952,
    "Jan-25": 2069,
    "Feb-25": 2521,
    "Mar-25": 2601,
  },
  {
    name: "Lifting Station 02",
    type: "LS",
    meterAccountNo: "R52328",
    "Apr-24": 44,
    "May-24": 0,
    "Jun-24": 0,
    "Jul-24": 0,
    "Aug-24": 153,
    "Sep-24": 125,
    "Oct-24": 0,
    "Nov-24": 0,
    "Dec-24": 0,
    "Jan-25": 0,
    "Feb-25": 0,
    "Mar-25": 0,
  },
  {
    name: "Lifting Station 03",
    type: "LS",
    meterAccountNo: "R52333",
    "Apr-24": 198,
    "May-24": 269,
    "Jun-24": 122,
    "Jul-24": 203,
    "Aug-24": 208,
    "Sep-24": 257,
    "Oct-24": 196,
    "Nov-24": 91,
    "Dec-24": 185,
    "Jan-25": 28,
    "Feb-25": 40,
    "Mar-25": 58,
  },
  {
    name: "Lifting Station 04",
    type: "LS",
    meterAccountNo: "R52324",
    "Apr-24": 644,
    "May-24": 865,
    "Jun-24": 791,
    "Jul-24": 768,
    "Aug-24": 747,
    "Sep-24": 723,
    "Oct-24": 628,
    "Nov-24": 686,
    "Dec-24": 631,
    "Jan-25": 701,
    "Feb-25": 638,
    "Mar-25": 572,
  },
  {
    name: "Lifting Station 05",
    type: "LS",
    meterAccountNo: "R52332",
    "Apr-24": 2056,
    "May-24": 2577,
    "Jun-24": 2361,
    "Jul-24": 3016,
    "Aug-24": 3684,
    "Sep-24": 5866,
    "Oct-24": 1715,
    "Nov-24": 2413,
    "Dec-24": 2643,
    "Jan-25": 2873,
    "Feb-25": 3665,
    "Mar-25": 3069,
  },
  {
    name: "Irrigation Tank 01",
    type: "IRR",
    meterAccountNo: "R52324 (R52326)",
    "Apr-24": 1543,
    "May-24": 2673,
    "Jun-24": 2763,
    "Jul-24": 2623,
    "Aug-24": 1467,
    "Sep-24": 1290,
    "Oct-24": 1244,
    "Nov-24": 1432,
    "Dec-24": 1268,
    "Jan-25": 1689,
    "Feb-25": 2214,
    "Mar-25": 1718,
  },
  {
    name: "Irrigation Tank 02",
    type: "IRR",
    meterAccountNo: "R52331",
    "Apr-24": 1272,
    "May-24": 2839,
    "Jun-24": 3118,
    "Jul-24": 2330,
    "Aug-24": 2458,
    "Sep-24": 1875,
    "Oct-24": 893,
    "Nov-24": 974,
    "Dec-24": 1026,
    "Jan-25": 983,
    "Feb-25": 1124,
    "Mar-25": 1110,
  },
  {
    name: "Irrigation Tank 03",
    type: "IRR",
    meterAccountNo: "R52323",
    "Apr-24": 894,
    "May-24": 866,
    "Jun-24": 1869,
    "Jul-24": 1543,
    "Aug-24": 1793,
    "Sep-24": 524,
    "Oct-24": 266,
    "Nov-24": 269,
    "Dec-24": 417,
    "Jan-25": 840,
    "Feb-25": 1009,
    "Mar-25": 845,
  },
  {
    name: "Irrigation Tank 04",
    type: "IRR",
    meterAccountNo: "R53195",
    "Apr-24": 880,
    "May-24": 827,
    "Jun-24": 555,
    "Jul-24": 443,
    "Aug-24": 336,
    "Sep-24": 195,
    "Oct-24": 183,
    "Nov-24": 212,
    "Dec-24": 213,
    "Jan-25": 40,
    "Feb-25": 233,
    "Mar-25": 235,
  },
  {
    name: "Actuator DB 01 (Z8)",
    type: "DB",
    meterAccountNo: "R53196",
    "Apr-24": 39,
    "May-24": 49,
    "Jun-24": 43,
    "Jul-24": 43,
    "Aug-24": 45,
    "Sep-24": 43,
    "Oct-24": 36,
    "Nov-24": 34,
    "Dec-24": 29,
    "Jan-25": 7,
    "Feb-25": 28,
    "Mar-25": 24,
  },
  {
    name: "Actuator DB 02",
    type: "DB",
    meterAccountNo: "R51900",
    "Apr-24": 285,
    "May-24": 335,
    "Jun-24": 275,
    "Jul-24": 220,
    "Aug-24": 210,
    "Sep-24": 219,
    "Oct-24": 165,
    "Nov-24": 232,
    "Dec-24": 161,
    "Jan-25": 33,
    "Feb-25": 134,
    "Mar-25": 139,
  },
  {
    name: "Actuator DB 03",
    type: "DB",
    meterAccountNo: "R51904",
    "Apr-24": 188,
    "May-24": 226,
    "Jun-24": 197,
    "Jul-24": 203,
    "Aug-24": 212,
    "Sep-24": 203,
    "Oct-24": 196,
    "Nov-24": 220,
    "Dec-24": 199,
    "Jan-25": 56,
    "Feb-25": 203,
    "Mar-25": 196,
  },
  {
    name: "Actuator DB 04",
    type: "DB",
    meterAccountNo: "R51901",
    "Apr-24": 159,
    "May-24": 275,
    "Jun-24": 258,
    "Jul-24": 210,
    "Aug-24": 184,
    "Sep-24": 201,
    "Oct-24": 144,
    "Nov-24": 172,
    "Dec-24": 173,
    "Jan-25": 186,
    "Feb-25": 161,
    "Mar-25": 227,
  },
  {
    name: "Actuator DB 05",
    type: "DB",
    meterAccountNo: "R51907",
    "Apr-24": 15,
    "May-24": 18,
    "Jun-24": 15,
    "Jul-24": 16,
    "Aug-24": 16,
    "Sep-24": 16,
    "Oct-24": 15,
    "Nov-24": 18,
    "Dec-24": 16,
    "Jan-25": 4,
    "Feb-25": 18,
    "Mar-25": 14,
  },
  {
    name: "Actuator DB 06",
    type: "DB",
    meterAccountNo: "R51909",
    "Apr-24": 39,
    "May-24": 50,
    "Jun-24": 42,
    "Jul-24": 48,
    "Aug-24": 46,
    "Sep-24": 129,
    "Oct-24": 43,
    "Nov-24": 49,
    "Dec-24": 44,
    "Jan-25": 47,
    "Feb-25": 45,
    "Mar-25": 38,
  },
  {
    name: "Street Light FP 01 (Z8)",
    type: "Street Light",
    meterAccountNo: "R53197",
    "Apr-24": 2773,
    "May-24": 3276,
    "Jun-24": 3268,
    "Jul-24": 3040,
    "Aug-24": 3203,
    "Sep-24": 3225,
    "Oct-24": 3064,
    "Nov-24": 3593,
    "Dec-24": 3147,
    "Jan-25": 787,
    "Feb-25": 3228,
    "Mar-25": 2663,
  },
  {
    name: "Street Light FP 02",
    type: "Street Light",
    meterAccountNo: "R51906",
    "Apr-24": 1705,
    "May-24": 2076,
    "Jun-24": 1758,
    "Jul-24": 1738,
    "Aug-24": 1940,
    "Sep-24": 2006,
    "Oct-24": 1944,
    "Nov-24": 2361,
    "Dec-24": 2258,
    "Jan-25": 633,
    "Feb-25": 2298,
    "Mar-25": 1812,
  },
  {
    name: "Street Light FP 03",
    type: "Street Light",
    meterAccountNo: "R51905",
    "Apr-24": 1399,
    "May-24": 1608,
    "Jun-24": 1365,
    "Jul-24": 1380,
    "Aug-24": 1457,
    "Sep-24": 1499,
    "Oct-24": 1561,
    "Nov-24": 2060,
    "Dec-24": 1966,
    "Jan-25": 1868,
    "Feb-25": 1974,
    "Mar-25": 1562,
  },
  {
    name: "Street Light FP 04",
    type: "Street Light",
    meterAccountNo: "R51908",
    "Apr-24": 861,
    "May-24": 1045,
    "Jun-24": 1051,
    "Jul-24": 2268,
    "Aug-24": 2478,
    "Sep-24": 2513,
    "Oct-24": 2341,
    "Nov-24": 2299,
    "Dec-24": 1389,
    "Jan-25": 325,
    "Feb-25": 1406,
    "Mar-25": 1401,
  },
  {
    name: "Street Light FP 05",
    type: "Street Light",
    meterAccountNo: "R51902",
    "Apr-24": 532,
    "May-24": 587,
    "Jun-24": 575,
    "Jul-24": 770,
    "Aug-24": 1341,
    "Sep-24": 1895,
    "Oct-24": 1844,
    "Nov-24": 1477,
    "Dec-24": 1121,
    "Jan-25": 449,
    "Feb-25": 2070,
    "Mar-25": 1870,
  },
  {
    name: "Beachwell",
    type: "D_Building",
    meterAccountNo: "R51903",
    "Apr-24": 16908,
    "May-24": 46,
    "Jun-24": 19332,
    "Jul-24": 23170,
    "Aug-24": 42241,
    "Sep-24": 15223,
    "Oct-24": 25370,
    "Nov-24": 24383,
    "Dec-24": 37236,
    "Jan-25": 38168,
    "Feb-25": 18422,
    "Mar-25": 40,
  },
  {
    name: "Helipad",
    type: "D_Building",
    meterAccountNo: "R52334",
    "Apr-24": 0,
    "May-24": 0,
    "Jun-24": 0,
    "Jul-24": 0,
    "Aug-24": 0,
    "Sep-24": 0,
    "Oct-24": 0,
    "Nov-24": 0,
    "Dec-24": 0,
    "Jan-25": 0,
    "Feb-25": 0,
    "Mar-25": 0,
  },
  {
    name: "Central Park",
    type: "D_Building",
    meterAccountNo: "R54672",
    "Apr-24": 12208,
    "May-24": 21845,
    "Jun-24": 29438,
    "Jul-24": 28186,
    "Aug-24": 21995,
    "Sep-24": 20202,
    "Oct-24": 14900,
    "Nov-24": 9604,
    "Dec-24": 19032,
    "Jan-25": 22819,
    "Feb-25": 19974,
    "Mar-25": 14190,
  },
  {
    name: "Guard House",
    type: "D_Building",
    meterAccountNo: "R53651",
    "Apr-24": 823,
    "May-24": 1489,
    "Jun-24": 1574,
    "Jul-24": 1586,
    "Aug-24": 1325,
    "Sep-24": 1391,
    "Oct-24": 1205,
    "Nov-24": 1225,
    "Dec-24": 814,
    'Jan  1574, "Jul-24': 1586,
    "Aug-24": 1325,
    "Sep-24": 1391,
    "Oct-24": 1205,
    "Nov-24": 1225,
    "Dec-24": 814,
    "Jan-25": 798,
    "Feb-25": 936,
    "Mar-25": 879,
  },
  {
    name: "Security Building",
    type: "D_Building",
    meterAccountNo: "R53649",
    "Apr-24": 3529,
    "May-24": 3898,
    "Jun-24": 4255,
    "Jul-24": 4359,
    "Aug-24": 3728,
    "Sep-24": 3676,
    "Oct-24": 3140,
    "Nov-24": 5702,
    "Dec-24": 5131,
    "Jan-25": 5559,
    "Feb-25": 5417,
    "Mar-25": 4504,
  },
  {
    name: "ROP Building",
    type: "D_Building",
    meterAccountNo: "R53648",
    "Apr-24": 2047,
    "May-24": 4442,
    "Jun-24": 3057,
    "Jul-24": 4321,
    "Aug-24": 4185,
    "Sep-24": 3554,
    "Oct-24": 3692,
    "Nov-24": 3581,
    "Dec-24": 2352,
    "Jan-25": 2090,
    "Feb-25": 2246,
    "Mar-25": 1939,
  },
  {
    name: "D Building 44",
    type: "D_Building",
    meterAccountNo: "R53705",
    "Apr-24": 463,
    "May-24": 2416,
    "Jun-24": 2036,
    "Jul-24": 2120,
    "Aug-24": 1645,
    "Sep-24": 1717,
    "Oct-24": 1643,
    "Nov-24": 1377,
    "Dec-24": 764,
    "Jan-25": 647,
    "Feb-25": 657,
    "Mar-25": 650,
  },
  {
    name: "D Building 45",
    type: "D_Building",
    meterAccountNo: "R53665",
    "Apr-24": 709,
    "May-24": 2944,
    "Jun-24": 1267,
    "Jul-24": 262,
    "Aug-24": 3212,
    "Sep-24": 1330,
    "Oct-24": 1570,
    "Nov-24": 1252,
    "Dec-24": 841,
    "Jan-25": 670,
    "Feb-25": 556,
    "Mar-25": 608,
  },
  {
    name: "D Building 46",
    type: "D_Building",
    meterAccountNo: "R53700",
    "Apr-24": 818,
    "May-24": 2392,
    "Jun-24": 1620,
    "Jul-24": 2216,
    "Aug-24": 1671,
    "Sep-24": 1718,
    "Oct-24": 1734,
    "Nov-24": 1577,
    "Dec-24": 890,
    "Jan-25": 724,
    "Feb-25": 690,
    "Mar-25": 752,
  },
  {
    name: "D Building 47",
    type: "D_Building",
    meterAccountNo: "R53690",
    "Apr-24": 918,
    "May-24": 2678,
    "Jun-24": 1446,
    "Jul-24": 2173,
    "Aug-24": 2068,
    "Sep-24": 2073,
    "Oct-24": 1651,
    "Nov-24": 1774,
    "Dec-24": 1055,
    "Jan-25": 887,
    "Feb-25": 738,
    "Mar-25": 792,
  },
  {
    name: "D Building 48",
    type: "D_Building",
    meterAccountNo: "R53666",
    "Apr-24": 725,
    "May-24": 1970,
    "Jun-24": 1415,
    "Jul-24": 1895,
    "Aug-24": 1853,
    "Sep-24": 1084,
    "Oct-24": 1127,
    "Nov-24": 1046,
    "Dec-24": 785,
    "Jan-25": 826,
    "Feb-25": 676,
    "Mar-25": 683,
  },
  {
    name: "D Building 49",
    type: "D_Building",
    meterAccountNo: "R53715",
    "Apr-24": 947,
    "May-24": 2912,
    "Jun-24": 780,
    "Jul-24": 1911,
    "Aug-24": 1714,
    "Sep-24": 1839,
    "Oct-24": 1785,
    "Nov-24": 1608,
    "Dec-24": 1068,
    "Jan-25": 860,
    "Feb-25": 837,
    "Mar-25": 818,
  },
  {
    name: "D Building 50",
    type: "D_Building",
    meterAccountNo: "R53672",
    "Apr-24": 577,
    "May-24": 1253,
    "Jun-24": 849,
    "Jul-24": 1097,
    "Aug-24": 1059,
    "Sep-24": 1091,
    "Oct-24": 1107,
    "Nov-24": 1102,
    "Dec-24": 789,
    "Jan-25": 765,
    "Feb-25": 785,
    "Mar-25": 707,
  },
  {
    name: "D Building 51",
    type: "D_Building",
    meterAccountNo: "R53657",
    "Apr-24": 735,
    "May-24": 3030,
    "Jun-24": 1677,
    "Jul-24": 2046,
    "Aug-24": 2472,
    "Sep-24": 2285,
    "Oct-24": 2165,
    "Nov-24": 1855,
    "Dec-24": 710,
    "Jan-25": 661,
    "Feb-25": 682,
    "Mar-25": 642,
  },
  {
    name: "D Building 52",
    type: "D_Building",
    meterAccountNo: "R53699",
    "Apr-24": 727,
    "May-24": 2882,
    "Jun-24": 2087,
    "Jul-24": 2897,
    "Aug-24": 2786,
    "Sep-24": 2990,
    "Oct-24": 2501,
    "Nov-24": 1986,
    "Dec-24": 1208,
    "Jan-25": 979,
    "Feb-25": 896,
    "Mar-25": 952,
  },
  {
    name: "D Building 53",
    type: "D_Building",
    meterAccountNo: "R54782",
    "Apr-24": 714,
    "May-24": 2699,
    "Jun-24": 1405,
    "Jul-24": 1845,
    "Aug-24": 1494,
    "Sep-24": 1709,
    "Oct-24": 1525,
    "Nov-24": 1764,
    "Dec-24": 968,
    "Jan-25": 693,
    "Feb-25": 732,
    "Mar-25": 760,
  },
  {
    name: "D Building 54",
    type: "D_Building",
    meterAccountNo: "R54793",
    "Apr-24": 717,
    "May-24": 2904,
    "Jun-24": 1961,
    "Jul-24": 2449,
    "Aug-24": 3031,
    "Sep-24": 1453,
    "Oct-24": 1261,
    "Nov-24": 1777,
    "Dec-24": 834,
    "Jan-25": 681,
    "Feb-25": 559,
    "Mar-25": 531,
  },
  {
    name: "D Building 55",
    type: "D_Building",
    meterAccountNo: "R54804",
    "Apr-24": 693,
    "May-24": 2550,
    "Jun-24": 1735,
    "Jul-24": 2430,
    "Aug-24": 2250,
    "Sep-24": 2100,
    "Oct-24": 1947,
    "Nov-24": 1828,
    "Dec-24": 1035,
    "Jan-25": 677,
    "Feb-25": 616,
    "Mar-25": 719,
  },
  {
    name: "D Building 56",
    type: "D_Building",
    meterAccountNo: "R54815",
    "Apr-24": 938,
    "May-24": 3099,
    "Jun-24": 1617,
    "Jul-24": 2384,
    "Aug-24": 2185,
    "Sep-24": 2190,
    "Oct-24": 2055,
    "Nov-24": 1805,
    "Dec-24": 937,
    "Jan-25": 683,
    "Feb-25": 731,
    "Mar-25": 765,
  },
  {
    name: "D Building 57",
    type: "D_Building",
    meterAccountNo: "R54826",
    "Apr-24": 574,
    "May-24": 2704,
    "Jun-24": 1816,
    "Jul-24": 2477,
    "Aug-24": 2429,
    "Sep-24": 1935,
    "Oct-24": 2260,
    "Nov-24": 2262,
    "Dec-24": 1332,
    "Jan-25": 990,
    "Feb-25": 846,
    "Mar-25": 795,
  },
  {
    name: "D Building 58",
    type: "D_Building",
    meterAccountNo: "R54836",
    "Apr-24": 568,
    "May-24": 2430,
    "Jun-24": 1555,
    "Jul-24": 2233,
    "Aug-24": 1860,
    "Sep-24": 1688,
    "Oct-24": 1469,
    "Nov-24": 1534,
    "Dec-24": 778,
    "Jan-25": 593,
    "Feb-25": 535,
    "Mar-25": 594,
  },
  {
    name: "D Building 59",
    type: "D_Building",
    meterAccountNo: "R54847",
    "Apr-24": 546,
    "May-24": 1847,
    "Jun-24": 1514,
    "Jul-24": 2112,
    "Aug-24": 1691,
    "Sep-24": 1792,
    "Oct-24": 1790,
    "Nov-24": 1634,
    "Dec-24": 998,
    "Jan-25": 628,
    "Feb-25": 582,
    "Mar-25": 697,
  },
  {
    name: "D Building 60",
    type: "D_Building",
    meterAccountNo: "R54858",
    "Apr-24": 628,
    "May-24": 1935,
    "Jun-24": 1327,
    "Jul-24": 1762,
    "Aug-24": 1269,
    "Sep-24": 1360,
    "Oct-24": 1260,
    "Nov-24": 1275,
    "Dec-24": 705,
    "Jan-25": 674,
    "Feb-25": 612,
    "Mar-25": 679,
  },
  {
    name: "D Building 61",
    type: "D_Building",
    meterAccountNo: "R54869",
    "Apr-24": 532,
    "May-24": 2022,
    "Jun-24": 1662,
    "Jul-24": 2255,
    "Aug-24": 1929,
    "Sep-24": 1958,
    "Oct-24": 1704,
    "Nov-24": 1734,
    "Dec-24": 977,
    "Jan-25": 767,
    "Feb-25": 800,
    "Mar-25": 719,
  },
  {
    name: "D Building 62",
    type: "D_Building",
    meterAccountNo: "R53717",
    "Apr-24": 858,
    "May-24": 2297,
    "Jun-24": 1744,
    "Jul-24": 2425,
    "Aug-24": 2018,
    "Sep-24": 1950,
    "Oct-24": 1768,
    "Nov-24": 1630,
    "Dec-24": 957,
    "Jan-25": 715,
    "Feb-25": 677,
    "Mar-25": 595,
  },
  {
    name: "D Building 74",
    type: "D_Building",
    meterAccountNo: "R53675",
    "Apr-24": 718,
    "May-24": 2495,
    "Jun-24": 1291,
    "Jul-24": 1895,
    "Aug-24": 1339,
    "Sep-24": 840,
    "Oct-24": 1147,
    "Nov-24": 1303,
    "Dec-24": 766,
    "Jan-25": 639,
    "Feb-25": 566,
    "Mar-25": 463,
  },
  {
    name: "D Building 75",
    type: "D_Building",
    meterAccountNo: "R53668",
    "Apr-24": 795,
    "May-24": 6744,
    "Jun-24": 983,
    "Jul-24": 1438,
    "Aug-24": 1268,
    "Sep-24": 1225,
    "Oct-24": 1125,
    "Nov-24": 1169,
    "Dec-24": 702,
    "Jan-25": 475,
    "Feb-25": 508,
    "Mar-25": 554,
  },
  {
    name: "Village Square",
    type: "D_Building",
    meterAccountNo: "R56628",
    "Apr-24": 2550,
    "May-24": 2550,
    "Jun-24": 2550,
    "Jul-24": 2550,
    "Aug-24": 8117,
    "Sep-24": 9087,
    "Oct-24": 4038,
    "Nov-24": 6229,
    "Dec-24": 3695,
    "Jan-25": 3304,
    "Feb-25": 3335,
    "Mar-25": 3383,
  },
  {
    name: "Zone-3 landscape light 17",
    type: "FP-Landscape Lights Z3",
    meterAccountNo: "R54872",
    "Apr-24": 0,
    "May-24": 0,
    "Jun-24": 0,
    "Jul-24": 0,
    "Aug-24": 0,
    "Sep-24": 0,
    "Oct-24": 0,
    "Nov-24": 0,
    "Dec-24": 0,
    "Jan-25": 0,
    "Feb-25": 0,
    "Mar-25": 0,
  },
  {
    name: "Zone-3 landscape light 21",
    type: "FP-Landscape Lights Z3",
    meterAccountNo: "R54873",
    "Apr-24": 42,
    "May-24": 67,
    "Jun-24": 37,
    "Jul-24": 42,
    "Aug-24": 40,
    "Sep-24": 33,
    "Oct-24": 28,
    "Nov-24": 40,
    "Dec-24": 48,
    "Jan-25": 13,
    "Feb-25": 57,
    "Mar-25": 47,
  },
  {
    name: "Zone-3 landscape light 22",
    type: "FP-Landscape Lights Z3",
    meterAccountNo: "R54874",
    "Apr-24": 5,
    "May-24": 10,
    "Jun-24": 3,
    "Jul-24": 5,
    "Aug-24": 4,
    "Sep-24": 5,
    "Oct-24": 12,
    "Nov-24": 6,
    "Dec-24": 8,
    "Jan-25": 0,
    "Feb-25": 0,
    "Mar-25": 0,
  },
  {
    name: "Bank muscat",
    type: "Retail",
    meterAccountNo: "",
    "Apr-24": 0,
    "May-24": 0,
    "Jun-24": 0,
    "Jul-24": 3,
    "Aug-24": 71,
    "Sep-24": -2,
    "Oct-24": 1407,
    "Nov-24": 148,
    "Dec-24": 72,
    "Jan-25": 59,
    "Feb-25": 98,
    "Mar-25": 88,
  },
  {
    name: "CIF kitchen",
    type: "Retail",
    meterAccountNo: "",
    "Apr-24": 0,
    "May-24": 0,
    "Jun-24": 0,
    "Jul-24": 17895,
    "Aug-24": 16532,
    "Sep-24": 18955,
    "Oct-24": 15071,
    "Nov-24": 16742,
    "Dec-24": 15554,
    "Jan-25": 16788,
    "Feb-25": 16154,
    "Mar-25": 14971,
  },
]

// Price per kWh in OMR
const PRICE_PER_KWH = 0.025

export function useElectricityData() {
  const [data, setData] = useState<ElectricityData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [months, setMonths] = useState<string[]>([])

  useEffect(() => {
    try {
      // Process the raw data
      const processedData = processRawData(rawData)
      setData(processedData)

      // Extract months from the first item
      if (rawData.length > 0) {
        const monthsList = Object.keys(rawData[0])
          .filter((key) => key.includes("-"))
          .sort((a, b) => {
            // Sort by year then month
            const [aMonth, aYear] = a.split("-")
            const [bMonth, bYear] = b.split("-")
            if (aYear !== bYear) return Number(aYear) - Number(bYear)
            return Number(aMonth) - Number(bMonth)
          })

        setMonths(monthsList)
        setSelectedMonth(monthsList[monthsList.length - 1]) // Default to latest month
      }

      setIsLoading(false)
    } catch (err) {
      setError("Error processing data")
      setIsLoading(false)
      console.error(err)
    }
  }, [])

  // Process the raw data into our desired format
  const processRawData = (rawData: any[]): ElectricityData[] => {
    return rawData.map((item) => {
      const monthlyConsumption: { month: string; value: number }[] = []
      let totalConsumption = 0

      // Extract monthly consumption
      Object.entries(item).forEach(([key, value]) => {
        if (key.includes("-")) {
          const consumption = Number(value)
          monthlyConsumption.push({ month: key, value: consumption })
          totalConsumption += consumption
        }
      })

      const averageConsumption = totalConsumption / monthlyConsumption.length
      const totalCost = totalConsumption * PRICE_PER_KWH
      const averageCost = averageConsumption * PRICE_PER_KWH

      return {
        name: item.name,
        type: item.type,
        meterAccountNo: item.meterAccountNo,
        monthlyConsumption,
        totalConsumption,
        averageConsumption,
        totalCost,
        averageCost,
      }
    })
  }

  // Get consumption by type
  const getConsumptionByType = (): ConsumptionByType[] => {
    const typeMap = new Map<string, { consumption: number; cost: number }>()

    data.forEach((item) => {
      const type = item.type
      const currentValue = typeMap.get(type) || { consumption: 0, cost: 0 }

      typeMap.set(type, {
        consumption: currentValue.consumption + item.totalConsumption,
        cost: currentValue.cost + item.totalCost,
      })
    })

    return Array.from(typeMap.entries()).map(([type, values]) => ({
      type,
      consumption: values.consumption,
      cost: values.cost,
    }))
  }

  // Get monthly consumption trend
  const getMonthlyConsumptionTrend = (): MonthlyTrend[] => {
    const monthlyMap = new Map<string, { consumption: number; cost: number }>()

    data.forEach((item) => {
      item.monthlyConsumption.forEach((month) => {
        const currentValue = monthlyMap.get(month.month) || { consumption: 0, cost: 0 }

        monthlyMap.set(month.month, {
          consumption: currentValue.consumption + month.value,
          cost: currentValue.cost + month.value * PRICE_PER_KWH,
        })
      })
    })

    return Array.from(monthlyMap.entries())
      .map(([month, values]) => ({
        month,
        consumption: values.consumption,
        cost: values.cost,
      }))
      .sort((a, b) => {
        // Sort by year then month
        const [aMonth, aYear] = a.month.split("-")
        const [bMonth, bYear] = b.month.split("-")
        if (aYear !== bYear) return Number(aYear) - Number(bYear)
        return Number(aMonth) - Number(bMonth)
      })
  }

  // Get top consumers
  const getTopConsumers = (limit = 10): ElectricityData[] => {
    return [...data].sort((a, b) => b.totalConsumption - a.totalConsumption).slice(0, limit)
  }

  // Get data for a specific month
  const getDataForMonth = (month: string): MonthlyData[] => {
    return data
      .map((item) => {
        const monthData = item.monthlyConsumption.find((m) => m.month === month)
        const consumption = monthData ? monthData.value : 0
        const cost = consumption * PRICE_PER_KWH

        return {
          name: item.name,
          type: item.type,
          meterAccountNo: item.meterAccountNo,
          consumption,
          cost,
        }
      })
      .sort((a, b) => b.consumption - a.consumption)
  }

  // Get total stats
  const getTotalStats = (): TotalStats => {
    const totalConsumption = data.reduce((sum, item) => sum + item.totalConsumption, 0)
    const totalCost = totalConsumption * PRICE_PER_KWH
    const averageMonthlyConsumption = totalConsumption / (months.length || 1)

    return {
      totalConsumption,
      totalCost,
      averageMonthlyConsumption,
      averageMonthlyConsumption,
    }
  }

  return {
    data,
    isLoading,
    error,
    selectedMonth,
    setSelectedMonth,
    getConsumptionByType,
    getMonthlyConsumptionTrend,
    getTopConsumers,
    getDataForMonth,
    getTotalStats,
    PRICE_PER_KWH,
    months,
  }
}
