"use client"

import { useState, useEffect } from "react"

// Define type for STP data records
export interface STPRecord {
  date: string
  tankersCount: number
  expectedTankerVolume: number
  directInlineSewage: number
  totalInletSewage: number
  totalTreatedWater: number
  totalTSEWaterOutput: number
  efficiency: number
  utilizationRate: number
}

// Define type for monthly aggregate data
export interface MonthlyAggregate {
  month: string
  formattedMonth: string
  avgTankersCount: number
  totalTankerVolume: number
  totalDirectSewage: number
  totalInletSewage: number
  totalTreatedWater: number
  totalIrrigationOutput: number
  avgEfficiency: number
  avgUtilizationRate: number
  daysInMonth: number
}

// Raw data provided in the paste.txt file
const rawSTPData = `Date:	Number of Tankers Discharged:	Expected Tanker Volume (m³) (20 m3)	Direct In line Sewage (MB)	Total Inlet Sewage Received from (MB+Tnk) -m³ 	Total Treated Water Produced - m³	Total TSE Water Output to Irrigation - m³
1/7/2024	10	200	139	339	385	340
2/7/2024	14	280	246	526	519	458
3/7/2024	13	260	208	468	479	425
4/7/2024	11	220	244	464	547	489
5/7/2024	15	300	265	565	653	574
6/7/2024	14	280	222	502	552	492
7/7/2024	13	260	289	549	575	498
8/7/2024	16	320	212	532	587	515
8/7/2024	16	320	219	539	589	515
9/7/2024	13	260	272	532	586	519
10/7/2024	12	240	253	493	542	462
12/7/2024	12	240	266	506	533	468
12/7/2024	16	320	258	578	654	580
13/07/2024	10	200	279	479	464	402
13/07/2024	10	200	279	479	464	402
14/07/2024	13	260	226	486	506	448
15/07/2024	6	120	271	391	482	418
16/07/2024	18	360	216	576	670	600
17/07/2024	12	240	266	506	344	300
18/07/2024	8	160	209	369	585	517
19/07/2024	15	300	314	614	687	605
20/07/2024	12	240	243	483	536	465
21/07/2024	13	260	241	501	504	455
22/07/2024	13	260	220	480	549	492
23/07/2024	16	320	248	568	611	535
24/07/2024	18	360	203	563	599	528
25/07/2024	14	280	135	415	517	444
26/07/2024	18	360	224	584	650	570
27/07/2024	10	200	337	537	475	414
28/07/2024	12	240	213	453	512	449
29/07/2024	19	380	305	685	671	577
30/07/2024	13	260	267	527	668	582
31/07/2024	17	340	266	606	613	529
1/8/2024	15	300	242	542	601	528
2/8/2024	15	300	360	660	676	590
3/8/2024	13	260	233	493	544	474
4/8/2024	13	260	250	510	571	497
5/8/2024	13	260	255	515	574	500
6/8/2024	16	320	284	604	643	554
7/8/2024	19	380	110	490	608	516
8/8/2024	17	340	302	642	610	524
9/8/2024	12	240	291	531	630	550
10/8/2024	13	260	265	525	583	499
11/8/2024	11	220	339	559	554	483
12/8/2024	12	240	229	469	606	531
13/08/2024	12	240	219	459	569	499
14/08/2024	11	220	289	509	525	492
15/08/2024	13	260	281	541	579	502
16/08/2024	11	220	328	548	591	516
17/08/2024	14	280	232	512	466	414
18/08/2024	13	260	218	478	591	516
19/08/2024	11	220	210	430	529	470
20/08/2024	13	260	261	521	579	495
21/08/2024	12	240	238	478	586	500
22/08/2024	13	260	292	552	486	437
23/08/2024	12	240	209	449	564	478
24/08/2024	9	180	281	461	581	505
25/08/2024	8	160	209	369	488	420
26/08/2024	8	160	249	409	371	291
27/08/2024	8	160	231	391	453	417
28/08/2024	9	180	355	535	642	557
29/08/2024	9	180	188	368	413	360
30/08/2024	14	280	346	626	624	551
31/08/2024	9	180	285	465	535	473
1/9/2024	11	220	257	477	504	441
2/9/2024	5	100	270	370	355	317
3/9/2024	9	180	261	441	540	481
4/9/2024	4	80	252	332	358	300
5/9/2024	6	120	330	450	547	483
6/9/2024	14	280	209	489	518	474
7/9/2024	12	240	319	559	568	504
8/9/2024	9	180	299	479	478	422
9/9/2024	9	180	283	463	515	459
10/9/2024	7	140	282	422	453	396
11/9/2024	12	240	279	519	566	495
12/9/2024	10	200	257	457	489	437
13/09/2024	14	280	284	564	671	611
14/09/2024	5	100	243	343	357	311
15/09/2024	7	140	208	348	354	307
16/09/2024	8	160	283	443	412	366
17/09/2024	8	160	143	303	352	314
18/09/2024	8	160	220	380	424	371
19/09/2024	9	180	198	378	441	401
20/09/2024	14	280	231	511	581	519
20/09/2024	14	280	231	511	581	519
21/09/2024	9	180	254	434	452	391
22/09/2024	9	180	190	370	355	317
23/09/2024	5	100	191	291	292	262
24/09/2024	8	160	302	462	555	498
25/09/2024	10	200	190	390	364	319
26/09/2024	7	140	212	352	386	342
27/09/2024	11	220	269	489	519	467
28/09/2024	8	160	323	483	539	469
29/09/2024	9	180	268	448	557	503
30/09/2024	6	120	304	424	388	350
30/09/2024	6	120	304	424	388	350
1/10/2024	5	100	305	405	482	417
2/10/2024	8	160	273	433	419	361
3/10/2024	9	180	295	475	575	520
4/10/2024	15	300	247	547	602	506
5/10/2024	8	160	362	522	555	515
6/10/2024	8	160	297	457	425	365
7/10/2024	11	220	324	544	592	533
8/10/2024	11	220	269	489	524	462
9/10/2024	11	220	312	532	637	568
10/10/2024	11	220	274	494	559	491
11/10/2024	12	240	309	549	541	438
12/10/2024	8	160	351	511	526	512
13/10/2024	6	120	212	332	405	345
14/10/2024	7	140	369	509	601	548
15/10/2024	10	200	381	581	569	489
16/10/2024	8	160	388	548	607	538
17/10/2024	11	220	416	636	659	575
18/10/2024	10	200	365	565	677	597
19/10/2024	8	160	429	589	583	509
20/10/2024	10	200	337	537	614	542
21/10/2024	12	240	299	539	585	513
22/10/2024	9	180	345	525	606	528
23/10/2024	11	220	372	592	614	532
24/10/2024	11	220	326	546	522	442
25/10/2024	9	180	423	603	601	524
26/10/2024	12	240	348	588	636	557
27/10/2024	6	120	403	523	594	487
28/10/2024	9	180	415	595	586	535
29/10/2024	7	140	371	511	613	535
30/10/2024	9	180	363	543	583	506
31/10/2024	7	140	437	577	577	500
1/11/2024	5	100	376	476	553	476
2/11/2024	8	160	393	553	609	513
3/11/2024	8	160	338	498	494	419
4/11/2024	6	120	310	430	542	480
5/11/2024	9	180	301	481	570	489
6/11/2024	7	140	231	371	423	351
7/11/2024	12	240	369	609	516	449
8/11/2024	11	220	296	516	621	538
9/11/2024	13	260	257	517	581	500
10/11/2024	6	120	344	464	573	495
11/11/2024	11	220	229	449	588	505
12/11/2024	8	160	306	466	567	494
13/11/2024	8	160	386	546	578	495
14/11/2024	9	180	324	504	567	484
15/11/2024	6	120	369	489	572	488
16/11/2024	9	180	340	520	559	474
17/11/2024	5	100	361	461	448	363
18/11/2024	10	200	275	475	534	466
19/11/2024	8	160	319	479	567	484
20/11/2024	6	120	345	465	579	494
21/11/2024	6	120	358	478	551	461
22/11/2024	7	140	354	494	574	488
23/11/2024	7	140	277	417	518	427
24/11/2024	4	80	307	387	507	434
25/11/2024	8	160	400	560	569	474
26/11/2024	10	200	301	501	561	471
27/11/2024	9	180	344	524	539	447
28/11/2024	7	140	347	487	548	456
29/11/2024	6	120	283	403	560	464
30/11/2024	6	120	400	520	520	427
1/12/2024	5	100	381	481	542	447
2/12/2024	6	120	376	496	526	442
3/12/2024	5	100	362	462	539	442
4/12/2024	5	100	257	357	537	449
5/12/2024	9	180	415	595	551	455
6/12/2024	4	80	357	437	484	403
7/12/2024	4	80	376	456	550	462
8/12/2024	5	100	362	462	570	474
9/12/2024	6	120	309	429	531	450
10/12/2024	8	160	293	453	493	412
11/12/2024	5	100	396	496	586	501
12/12/2024	5	100	341	441	554	461
13/12/2024	8	160	281	441	507	439
14/12/2024	8	160	346	506	585	515
15/12/2024	7	140	361	501	493	414
16/12/2024	6	120	318	438	541	468
17/12/2024	9	180	373	553	580	476
18/12/2024	7	140	356	496	581	498
19/12/2024	8	160	382	542	560	471
20/12/2024	8	160	280	440	585	488
21/12/2024	6	120	382	502	575	475
22/12/2024	7	140	396	536	606	513
23/12/2024	7	140	308	448	587	497
24/12/2024	4	80	446	526	542	449
25/12/2024	6	120	397	517	614	513
26/12/2024	8	160	371	531	590	495
27/12/2024	5	100	442	542	621	517
28/12/2024	7	140	401	541	611	524
29/12/2024	7	140	388	528	605	511
30/12/2024	7	140	385	525	598	509
31/12/2024	4	80	455	535	600	506
1/1/2025	3	60	433	493	601	504
2/1/2025	3	60	468	528	600	491
3/1/2025	4	80	370	450	577	494
4/1/2025	4	80	427	507	587	486
5/1/2025	4	80	393	473	532	445
6/1/2025	4	80	365	445	572	472
7/1/2025	7	140	409	549	610	506
8/1/2025	5	100	411	511	526	454
9/1/2025	6	120	394	514	589	494
10/1/2025	8	160	375	535	637	528
11/1/2025	3	60	376	436	552	459
12/1/2025	6	120	353	473	508	419
13/01/2025	6	120	336	456	581	489
14/01/2025	8	160	353	513	594	502
15/01/2025	8	160	334	494	593	504
16/01/2025	10	200	309	509	521	438
17/01/2025	7	140	362	502	595	518
18/01/2025	8	160	377	537	608	526
19/01/2025	8	160	400	560	605	523
20/01/2025	8	160	357	517	595	503
21/01/2025	8	160	392	552	602	517
22/01/2025	6	120	362	482	576	498
23/01/2025	6	120	357	477	599	526
24/01/2025	7	140	364	504	606	499
25/01/2025	8	160	383	543	601	523
26/01/2025	8	160	349	509	605	516
27/01/2025	8	160	359	519	601	515
28/01/2025	11	220	362	582	607	519
29/01/2025	9	180	341	521	615	529
30/01/2025	9	180	339	519	598	510
31/01/2025	7	140	373	513	619	526
1/2/2025	8	160	351	511	527	456
2/2/2025	9	180	331	511	505	423
3/2/2025	8	160	336	496	584	489
4/2/2025	9	180	365	545	578	484
5/2/2025	6	120	407	527	582	482
6/2/2025	8	160	322	482	588	493
7/2/2025	6	120	365	485	576	482
8/2/2025	4	80	451	531	582	478
9/2/2025	9	180	341	521	586	489
10/2/2025	6	120	394	514	594	495
11/2/2025	7	140	406	546	589	501
12/2/2025	5	100	428	528	614	527
13/02/2025	4	80	423	503	620	525
14/02/2025	4	80	474	554	614	527
15/02/2025	4	80	458	538	627	533
16/02/2025	5	100	461	561	630	539
17/02/2025	5	100	444	544	628	539
18/02/2025	5	100	417	517	609	520
19/02/2025	4	80	459	539	582	489
20/02/2025	2	40	442	482	553	459
21/02/2025	1	20	458	478	518	419
24/02/2025	0	0	491	491	437	361
25/02/2025	0	0	334	334	247	159
26/02/2025	0	0	342	342	272	226
27/02/2025	0	0	502	502	595	512
28/02/2025	2	40	458	498	571	468
1/3/2025	0	0	487	487	583	476
2/3/2025	1	20	473	493	592	514
3/3/2025	1	20	477	497	598	517
4/3/2025	5	100	461	561	600	516
5/3/2025	3	60	443	503	608	521
6/3/2025	6	120	424	544	607	530
7/3/2025	5	100	452	552	621	532
8/3/2025	6	120	450	570	617	531
9/3/2025	4	80	388	468	607	521
10/3/2025	6	120	480	600	610	524
11/3/2025	3	60	476	536	607	511
12/3/2025	6	120	391	511	601	509
13/03/2025	3	60	472	532	606	508
14/03/2025	6	120	399	519	609	507
15/03/2025	2	40	494	534	602	504
16/03/2025	4	80	434	514	591	494
17/03/2025	4	80	442	522	591	500
18/03/2025	5	100	369	469	578	480
19/03/2025	3	60	466	526	565	467
20/03/2025	4	80	424	504	610	511
21/03/2025	4	80	425	505	619	519
22/03/2025	5	100	435	535	616	523
23/03/2025	6	120	466	586	627	541
24/03/2025	6	120	422	542	630	540
25/03/2025	5	100	488	588	613	522
26/03/2025	8	160	353	513	631	541
27/03/2025	7	140	513	653	627	538
28/03/2025	3	60	478	538	631	546
29/03/2025	4	80	559	639	623	534
30/03/2025	3	60	471	531	640	558
31/03/2025	3	60	471	531	640	558
1/4/2025	5	100	485	585	639	551
2/4/2025	6	120	475	595	650	560
3/4/2025	5	100	473	573	634	556
4/4/2025	4	80	529	609	656	573
5/4/2025	5	100	495	595	648	569
6/4/2025	6	120	439	559	658	579
7/4/2025	7	140	410	550	653	574
8/4/2025	8	160	481	641	648	562
9/4/2025	5	100	478	578	656	568
10/4/2025	6	120	497	617	654	558
11/4/2025	6	120	456	576	671	582
12/4/2025	8	160	460	620	660	576
13/04/2025	5	100	517	617	676	595
14/04/2025	8	160	441	601	673	592
15/04/2025	7	140	421	561	641	557
16/04/2025	8	160	483	643	674	590
17/04/2025	6	120	444	564	665	581
18/04/2025	7	140	449	589	660	577
19/04/2025	7	140	449	589	660	577
19/04/2025	8	160	446	606	647	563
20/04/2025	7	140	514	654	647	553
21/04/2025	6	120	404	524	635	524
22/04/2025	3	60	525	585	647	565
23/04/2025	5	100	489	589	688	578
24/04/2025	6	120	486	606	695	594
25/04/2025	6	120	478	598	712	609
26/04/2025	6	120	518	638	706	584
27/04/2025	5	100	480	580	714	603
28/04/2025	5	100	473	573	716	607
29/04/2025	9	180	444	624	710	602
30/04/2025	9	180	462	642	710	646
1/5/2025	9	180	451	631	717	631
2/5/2025	11	220	471	691	703	626
3/5/2025	9	180	496	676	681	608
4/5/2025	8	160	472	632	709	635
5/5/2025	9	180	365	545	672	593
6/5/2025	11	220	374	594	657	569
7/5/2025	10	200	445	645	700	627
8/5/2025	12	240	351	591	666	593
9/5/2025	10	200	455	655	667	592
10/5/2025	10	200	463	663	705	630
11/5/2025	8	160	464	624	725	646
12/5/2025	9	180	489	669	623	645`

// Helper function to format date (DD/MM/YYYY to YYYY-MM-DD)
const formatDate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/').map(part => part.trim())
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

// Parse STP data from raw text
const parseStpData = (rawData: string): STPRecord[] => {
  try {
    const lines = rawData.trim().split("\n")
    // Skip the header line
    const dataLines = lines.slice(1)

    return dataLines.map((line) => {
      const columns = line.split("\t").map((col) => col.trim())

      // Normalize date format (might be d/m/yyyy or dd/mm/yyyy)
      let dateParts = columns[0].split("/")
      if (dateParts.length !== 3) {
        // Handle potential date format issues
        console.error(`Invalid date format: ${columns[0]}`)
        dateParts = ["01", "01", "2025"] // Default date as fallback
      }

      const day = dateParts[0].padStart(2, "0")
      const month = dateParts[1].padStart(2, "0")
      const year = dateParts[2]
      const formattedDate = `${year}-${month}-${day}`

      const tankersCount = Number(columns[1]) || 0
      const expectedTankerVolume = Number(columns[2]) || 0
      const directInlineSewage = Number(columns[3]) || 0
      const totalInletSewage = Number(columns[4]) || 0
      const totalTreatedWater = Number(columns[5]) || 0
      const totalTSEWaterOutput = Number(columns[6]) || 0

      // Calculate efficiency (treated water output / total inlet sewage)
      const efficiency = totalInletSewage > 0 ? (totalTreatedWater / totalInletSewage) * 100 : 0

      // Calculate utilization rate (total treated water / plant capacity)
      // Assuming plant capacity is 750 m³/day
      const utilizationRate = (totalTreatedWater / 750) * 100

      return {
        date: formattedDate,
        tankersCount,
        expectedTankerVolume,
        directInlineSewage,
        totalInletSewage,
        totalTreatedWater,
        totalTSEWaterOutput,
        efficiency,
        utilizationRate,
      }
    })
  } catch (error) {
    console.error("Error parsing STP data:", error)
    return []
  }
}

// Group data by month
const groupDataByMonth = (data: STPRecord[]): Record<string, STPRecord[]> => {
  const groupedData: Record<string, STPRecord[]> = {}

  data.forEach((record) => {
    const month = record.date.substring(0, 7) // YYYY-MM format
    if (!groupedData[month]) {
      groupedData[month] = []
    }
    groupedData[month].push(record)
  })

  return groupedData
}

// Calculate monthly aggregates
const calculateMonthlyAggregates = (groupedData: Record<string, STPRecord[]>): MonthlyAggregate[] => {
  return Object.entries(groupedData)
    .map(([month, records]) => {
      const daysInMonth = records.length

      // Calculate totals
      const totalTankerVolume = records.reduce((sum, record) => sum + record.expectedTankerVolume, 0)
      const totalDirectSewage = records.reduce((sum, record) => sum + record.directInlineSewage, 0)
      const totalInletSewage = records.reduce((sum, record) => sum + record.totalInletSewage, 0)
      const totalTreatedWater = records.reduce((sum, record) => sum + record.totalTreatedWater, 0)
      const totalIrrigationOutput = records.reduce((sum, record) => sum + record.totalTSEWaterOutput, 0)

      // Calculate averages
      const avgTankersCount = records.reduce((sum, record) => sum + record.tankersCount, 0) / daysInMonth
      const avgEfficiency = records.reduce((sum, record) => sum + record.efficiency, 0) / daysInMonth
      const avgUtilizationRate = records.reduce((sum, record) => sum + record.utilizationRate, 0) / daysInMonth

      // Format month for display
      const date = new Date(`${month}-01`)
      const formattedMonth = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

      return {
        month,
        formattedMonth,
        avgTankersCount,
        totalTankerVolume,
        totalDirectSewage,
        totalInletSewage,
        totalTreatedWater,
        totalIrrigationOutput,
        avgEfficiency,
        avgUtilizationRate,
        daysInMonth,
      }
    })
    .sort((a, b) => a.month.localeCompare(b.month))
}

// Hook to use real STP data
export const useRealSTPData = (selectedMonth: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [allData, setAllData] = useState<STPRecord[]>([])
  const [monthlyAggregates, setMonthlyAggregates] = useState<MonthlyAggregate[]>([])
  const [availableMonths, setAvailableMonths] = useState<{ value: string; label: string }[]>([])
  const [kpiData, setKpiData] = useState({
    totalInflow: 0,
    totalOutflow: 0,
    efficiency: 0,
    utilization: 0,
    qualityIndex: 0,
    inflowChange: 0,
    outflowChange: 0,
    efficiencyChange: 0,
    utilizationChange: 0,
    qualityChange: 0,
  })
  const [sankeyData, setSankeyData] = useState({
    nodes: [{ name: "Loading..." }],
    links: [],
  })
  const [dailyData, setDailyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [rawData, setRawData] = useState([])
  const [previousMonthRawData, setPreviousMonthRawData] = useState([])

  // Initialize data on first load
  useEffect(() => {
    setIsLoading(true)

    try {
      // Parse the raw data
      const parsedData = parseStpData(rawSTPData)
      setAllData(parsedData)

      // Group by month and calculate aggregates
      const groupedData = groupDataByMonth(parsedData)
      const aggregates = calculateMonthlyAggregates(groupedData)
      setMonthlyAggregates(aggregates)

      // Create month options for selector
      const months = aggregates.map((agg) => ({
        value: agg.month,
        label: agg.formattedMonth,
      }))
      setAvailableMonths(months)

      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing STP data:", error)
      setIsLoading(false)
    }
  }, [])

  // Update displayed data when selected month changes
  useEffect(() => {
    if (allData.length === 0 || monthlyAggregates.length === 0) return

    setIsLoading(true)

    try {
      // Get the selected month data and aggregate
      const groupedData = groupDataByMonth(allData)
      const selectedMonthData = groupedData[selectedMonth] || []
      const selectedMonthAggregate = monthlyAggregates.find((agg) => agg.month === selectedMonth)

      // Find the previous month aggregate for comparison
      const currentMonthIndex = monthlyAggregates.findIndex((agg) => agg.month === selectedMonth)
      const previousMonthAggregate = currentMonthIndex > 0 ? monthlyAggregates[currentMonthIndex - 1] : null

      // Calculate KPI data
      const newKpiData = {
        totalInflow: selectedMonthAggregate?.totalInletSewage || 0,
        totalOutflow: selectedMonthAggregate?.totalTreatedWater || 0,
        efficiency: Number((selectedMonthAggregate?.avgEfficiency || 0).toFixed(1)),
        utilization: Number((selectedMonthAggregate?.avgUtilizationRate || 0).toFixed(1)),
        qualityIndex: 8.7, // Placeholder - could be calculated from water quality parameters if available
        inflowChange: previousMonthAggregate
          ? calculatePercentageChange(
              selectedMonthAggregate?.totalInletSewage || 0,
              previousMonthAggregate.totalInletSewage
            )
          : 0,
        outflowChange: previousMonthAggregate
          ? calculatePercentageChange(
              selectedMonthAggregate?.totalTreatedWater || 0,
              previousMonthAggregate.totalTreatedWater
            )
          : 0,
        efficiencyChange: previousMonthAggregate
          ? calculatePercentageChange(
              selectedMonthAggregate?.avgEfficiency || 0,
              previousMonthAggregate.avgEfficiency
            )
          : 0,
        utilizationChange: previousMonthAggregate
          ? calculatePercentageChange(
              selectedMonthAggregate?.avgUtilizationRate || 0,
              previousMonthAggregate.avgUtilizationRate
            )
          : 0,
        qualityChange: 1.2, // Placeholder value
      }
      setKpiData(newKpiData)

      // Create Sankey data for flow visualization
      const newSankeyData = {
        nodes: [
          { name: "Inflow" },
          { name: "Tanker Discharge" },
          { name: "Direct Sewage" },
          { name: "Primary Treatment" },
          { name: "Secondary Treatment" },
          { name: "Tertiary Treatment" },
          { name: "TSE Output" },
          { name: "Losses" },
        ],
        links: [
          { source: 0, target: 3, value: selectedMonthAggregate?.totalInletSewage || 0 },
          { source: 1, target: 0, value: selectedMonthAggregate?.totalTankerVolume || 0 },
          { source: 2, target: 0, value: selectedMonthAggregate?.totalDirectSewage || 0 },
          { source: 3, target: 4, value: Math.round((selectedMonthAggregate?.totalInletSewage || 0) * 0.95) },
          { source: 3, target: 7, value: Math.round((selectedMonthAggregate?.totalInletSewage || 0) * 0.05) },
          { source: 4, target: 5, value: Math.round((selectedMonthAggregate?.totalInletSewage || 0) * 0.9) },
          { source: 4, target: 7, value: Math.round((selectedMonthAggregate?.totalInletSewage || 0) * 0.05) },
          { source: 5, target: 6, value: selectedMonthAggregate?.totalIrrigationOutput || 0 },
          { source: 5, target: 7, value: Math.round((selectedMonthAggregate?.totalInletSewage || 0) * 0.05) },
        ],
      }
      setSankeyData(newSankeyData)

      // Create daily data for charts
      const newDailyData = selectedMonthData.map((record) => ({
        day: new Date(record.date).getDate().toString(),
        efficiency: Number(record.efficiency.toFixed(1)),
        flowRate: record.totalInletSewage,
        qualityIndex: 7 + Math.random() * 3, // Placeholder - would be actual water quality data if available
      }))
      setDailyData(newDailyData)

      // Create monthly data for trends
      const newMonthlyData = monthlyAggregates.map((agg) => ({
        month: agg.formattedMonth.substring(0, 3),
        efficiency: Number(agg.avgEfficiency.toFixed(1)),
        target: 85, // Placeholder target value
        flowRate: Math.round(agg.totalInletSewage / agg.daysInMonth),
      }))
      setMonthlyData(newMonthlyData)

      // Create raw data for table
      const newRawData = selectedMonthData.map((record, index) => ({
        id: index + 1,
        date: new Date(record.date).toLocaleDateString(),
        influentFlow: record.totalInletSewage,
        effluentFlow: record.totalTreatedWater,
        efficiency: Number(record.efficiency.toFixed(1)),
        energyUsage: Math.round(200 + (record.totalTreatedWater / 750) * 50), // Estimated based on plant load
        chemicalUsage: Math.round(50 + (record.totalTreatedWater / 750) * 20), // Estimated based on plant load
      }))
      setRawData(newRawData)

      // Get previous month data for comparison
      const previousMonthData = previousMonthAggregate
        ? groupedData[previousMonthAggregate.month] || []
        : []

      const newPreviousMonthRawData = previousMonthData.map((record, index) => ({
        id: index + 1,
        date: new Date(record.date).toLocaleDateString(),
        influentFlow: record.totalInletSewage,
        effluentFlow: record.totalTreatedWater,
        efficiency: Number(record.efficiency.toFixed(1)),
        energyUsage: Math.round(190 + (record.totalTreatedWater / 750) * 50), // Estimated
        chemicalUsage: Math.round(48 + (record.totalTreatedWater / 750) * 20), // Estimated
      }))
      setPreviousMonthRawData(newPreviousMonthRawData)

      setIsLoading(false)
    } catch (error) {
      console.error("Error updating STP data for selected month:", error)
      setIsLoading(false)
    }
  }, [selectedMonth, allData, monthlyAggregates])

  return {
    kpiData,
    sankeyData,
    dailyData,
    monthlyData,
    rawData,
    previousMonthRawData,
    isLoading,
    availableMonths,
  }
}
