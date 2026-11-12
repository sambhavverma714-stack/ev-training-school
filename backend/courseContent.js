// All course content: overviews, lessons, and assessment questions.
// To add a course, copy one block below and give it a new id.

const COURSES = [
  {
    id: 'hv-safety',
    title: 'High-Voltage Safety & PPE',
    level: 'Foundation',
    hours: 4,
    passingScore: 80,
    description: 'Learn how high-voltage systems in electric and hybrid vehicles can injure or kill, which PPE to wear, how to isolate a vehicle safely, and how to respond to a damaged EV.',
    modules: [
      {
        id: 'hv-1',
        title: 'Course Overview and Learning Outcomes',
        content: [
          'By the end of this course you will be able to: identify high-voltage (HV) components in electric and hybrid vehicles; explain the main electrical hazards; select and inspect the correct PPE; follow the five-step isolation procedure; and respond safely to a crash-damaged HV vehicle.',
          'Who this is for: apprentices, qualified technicians, workshop supervisors, and anyone who may be asked to lift, move, or inspect an EV. No prior EV experience is needed, but you should understand basic electrical safety and be comfortable using standard hand tools.',
          'How the course works: read each module, press Mark as complete, and move on. The final assessment unlocks when every module is complete. You need 80% (4 of 5 questions correct) to pass and earn your certificate. You can retake the assessment as many times as you need.',
          'References: NFPA 70E, Standard for Electrical Safety in the Workplace; OSHA 29 CFR 1910.332 to 1910.339 (electrical safety-related work practices); SAE J2990 (first and second responder guidance for hybrid and electric vehicles); and the manufacturer\'s service information for each model you work on.'
        ]
      },
      {
        id: 'hv-2',
        title: 'Understanding HV Hazards',
        content: [
          'EV and hybrid high-voltage systems typically run between about 300 V and 800 V DC, and some newer platforms operate higher. Voltage at this level can cause severe burns, cardiac arrest, and death. Injury depends mainly on the current that passes through the body, the path it takes, and how long it flows.',
          'DC is especially dangerous at high voltage because it can cause the muscles to lock, so a person may be unable to let go of a live part. Arc flash is a second major hazard: when a live connection is broken or shorted, the energy released can produce an intense flash, a pressure wave, and sprayed molten metal.',
          'Stored energy is the third hazard. Capacitors in inverters and onboard chargers can hold a charge after the vehicle is switched off, which is why the isolation procedure includes a waiting period and a verification step.',
          'Look for the visual signs: orange cables and connectors, orange warning labels, and HV warning symbols on covers. Treat every orange component as live until a rated meter proves otherwise. Some HV parts have no visible markings, so the service information for each model is the final authority.'
        ]
      },
      {
        id: 'hv-3',
        title: 'Personal Protective Equipment (PPE)',
        content: [
          'Insulated Class 0 gloves, rated to 1,000 V AC, are the minimum glove for most HV work on common EV platforms. Always wear leather protector gloves over the rubber gloves to guard against cuts and punctures.',
          'Inspect gloves before every use for holes, cuts, cracks, and sticky or swollen areas. Use the air or visual test your workshop procedure specifies and check the retest date. Gloves that have been dropped, left in a hot vehicle, or used past their retest date must be removed from service.',
          'Wear arc-rated clothing suited to the energy level of the task, safety glasses or a face shield under an arc-rated hood, and safety footwear. Remove rings, watches, necklaces, and metal bracelets before working near HV components.',
          'Use insulated tools rated for the job and keep them in a tray or bag so they cannot fall onto the battery. Gloves are a last line of defence, not a substitute for isolation. Gloves can be damaged without you noticing, so always isolate and verify the circuit first. Do not work alone on HV systems unless your employer\'s procedure allows it.'
        ]
      },
      {
        id: 'hv-4',
        title: 'The 5-Step Safety Procedure',
        content: [
          'Before any work on a high-voltage system, follow these five steps in order. Do not skip steps, and do not treat them as optional because a job looks simple.',
          '1. Disconnect and isolate: switch the vehicle off, disconnect the 12 V battery if the manufacturer requires it, then remove the HV service disconnect using the manufacturer\'s sequence.',
          '2. Lock out and tag out: lock the service disconnect point and attach a tag with your name and the date so nobody can reconnect the system while you work.',
          '3. Wait and verify zero voltage: wait for the discharge time in the service information, then measure between each HV conductor and to chassis with a rated meter. Use a live-dead-live check: test your meter on a known live source, test the circuit, then test the meter again.',
          '4. Discharge where required: discharge capacitors only if the procedure calls for it, using the approved tool. Never short the battery pack terminals.',
          '5. Barrier and cover: cover or barrier any live parts that remain nearby, such as connected orange cables, and mark the work area so others know it is in progress.',
          'Re-energising follows the same discipline in reverse. Confirm all tools are accounted for and everyone is clear of the vehicle, then remove your locks and tags only after the work is complete.'
        ]
      },
      {
        id: 'hv-5',
        title: 'Emergency Response and Damaged HV Vehicles',
        content: [
          'A crash-damaged EV can remain energised. The battery pack may be damaged even when the outside looks normal, and HV cables may be cut, pinched, or exposed. Assume the HV system is live until a qualified person confirms otherwise.',
          'SAE J2990 provides guidance for first and second responders to EV and hybrid vehicles. Before approaching a crashed vehicle, look for smoke, fluid leaks, burning smells, and orange cables that are cut or exposed. Keep clear of exposed cables and the battery area, and do not touch or cut orange cables.',
          'If a battery is smoking, hissing, or showing signs of heat, evacuate the area, keep people upwind, call emergency services, and tell them an EV battery is involved. Follow the manufacturer\'s emergency response guide for the specific model.',
          'Damaged battery packs can reignite hours or days after an incident. Where the guide allows it, store the vehicle outdoors and away from buildings, and monitor it until it has been assessed by a qualified specialist.'
        ]
      }
    ],
    assessment: [
      {
        id: 'hv-q1',
        question: 'What colour identifies high-voltage cabling in most EVs?',
        options: ['Red', 'Blue', 'Orange', 'Green'],
        answer: 2
      },
      {
        id: 'hv-q2',
        question: 'What is the minimum voltage rating for Class 0 insulating gloves?',
        options: ['500 V AC', '1,000 V AC', '5,000 V AC', '10,000 V AC'],
        answer: 1
      },
      {
        id: 'hv-q3',
        question: 'Which step comes first in the 5-step HV safety procedure?',
        options: [
          'Verify zero voltage',
          'Lock out and tag out',
          'Disconnect and isolate the power source',
          'Put on gloves'
        ],
        answer: 2
      },
      {
        id: 'hv-q4',
        question: 'What does a live-dead-live check involve?',
        options: [
          'Testing the meter on a known live source, testing the circuit, then testing the meter again on a known live source',
          'Checking the circuit twice with the same meter',
          'Leaving the meter connected while you work',
          'Testing only the 12 V battery'
        ],
        answer: 0
      },
      {
        id: 'hv-q5',
        question: 'Why must you wait for the discharge time before measuring an HV system?',
        options: [
          'It lets the paint dry',
          'Capacitors may still hold a charge after isolation',
          'The battery needs time to balance',
          'The insurance company requires it'
        ],
        answer: 1
      }
    ]
  },
  {
    id: 'battery-diagnostics',
    title: 'Lithium-Ion Battery Diagnostics',
    level: 'Intermediate',
    hours: 6,
    passingScore: 80,
    description: 'Understand EV pack architecture and cell chemistry, the Battery Management System, insulation resistance testing, state-of-health assessment, and how to respond to a thermal event.',
    modules: [
      {
        id: 'bat-1',
        title: 'Course Overview and Learning Outcomes',
        content: [
          'By the end of this course you will be able to: describe how an EV battery pack is built; explain what the Battery Management System (BMS) does; carry out an insulation resistance test; estimate state of health (SoH); and recognise and respond to a thermal event.',
          'Recommended before starting: the High-Voltage Safety & PPE course, or equivalent training. You should be able to follow the five-step isolation procedure before starting any practical task in this course.',
          'How the course works: each module builds on the one before. The final assessment unlocks when all five modules are marked complete. You need 80% (4 of 5 questions correct) to pass.',
          'References: NFPA 70E, Standard for Electrical Safety in the Workplace; ISO 6469 (safety requirements for electrically propelled road vehicles); SAE J2990; and the manufacturer\'s service information for battery isolation and insulation test limits.'
        ]
      },
      {
        id: 'bat-2',
        title: 'Pack Architecture and Cell Chemistry',
        content: [
          'An EV battery pack is built from cells. Cells are grouped into modules, and modules are assembled into the pack. Cells connected in series raise the voltage, and cells connected in parallel increase capacity. A pack has hundreds of cells, and its voltage is the sum of the cell voltages in series.',
          'Common chemistries include NMC (nickel manganese cobalt), which offers high energy density, and LFP (lithium iron phosphate), which offers longer cycle life and better thermal stability but lower energy density. A typical NMC cell has a nominal voltage around 3.6 to 3.7 V, while an LFP cell is around 3.2 V. Never assume the chemistry; confirm it in the service data.',
          'The pack also contains contactors (high-power switches) that connect and disconnect the battery from the HV system, a service disconnect for maintenance, current and temperature sensors, and cooling plates or channels that carry coolant through the pack.'
        ]
      },
      {
        id: 'bat-3',
        title: 'The Battery Management System (BMS)',
        content: [
          'The BMS measures cell voltage, pack current, and temperature many times per second. It estimates state of charge (SoC) and state of health (SoH), protects the cells from overcharge, over-discharge, overcurrent, and overheating, and controls the contactors.',
          'Cell balancing keeps all cells at similar voltages. Passive balancing bleeds energy from the highest cells as heat through resistors. Active balancing moves charge from stronger cells to weaker ones. Imbalance that grows over time reduces usable capacity and can cause early charging and power limits.',
          'Fault codes stored by the BMS, such as cell voltage deviation or isolation faults, point you to a subsystem. Read the codes with a compatible scan tool, record the freeze frame data and the pack state at the time of the fault, and check service bulletins before replacing any parts.'
        ]
      },
      {
        id: 'bat-4',
        title: 'Insulation Resistance Testing',
        content: [
          'Insulation resistance tests confirm that HV conductors are isolated from the vehicle chassis. Low insulation resistance can allow leakage current, which is a shock hazard and can trigger an isolation fault. Common causes include moisture, a damaged cable sheath, a failed component, and contamination.',
          'Use a rated insulation tester at the test voltage given by the manufacturer, often 500 V or 1,000 V DC. Test each HV conductor to chassis, then compare the readings with the manufacturer\'s service limits. A reading that falls over time, or after exposure to water, is a warning sign even if it is still within limits.',
          'Only test with the HV system isolated, and follow the five-step procedure before connecting any test leads. Discharge the test point as the tester instructs once the reading is complete.',
          'Record every reading with the test voltage, the temperature and humidity, and the component or connector tested. Comparing readings over time is more useful than any single result.'
        ]
      },
      {
        id: 'bat-5',
        title: 'State of Health and Thermal Events',
        content: [
          'State of Health (SoH) compares the usable capacity of the pack today with its original capacity, expressed as a percentage. SoH can be estimated from a controlled capacity test, from BMS models, or from internal resistance. A scan tool estimate is useful but not exact, so always record the method used.',
          'Battery ageing comes from cycling, time, temperature, and charging habits. Heat, deep discharge, and frequent fast charging accelerate ageing. Before condemning a pack, check for software updates, cell imbalance, and cooling faults, because a problem may affect only one module.',
          'A thermal event occurs when a cell overheats and enters thermal runaway, a self-sustaining reaction that releases heat, flammable gas, and possibly toxic gas. Warning signs include hissing or popping sounds, an unusual smell, swelling, smoke, and a rapid temperature rise.',
          'If you see these signs, evacuate, keep people upwind, call emergency services, and tell them an EV battery is involved. Do not attempt to open or move the pack.'
        ]
      }
    ],
    assessment: [
      {
        id: 'bat-q1',
        question: 'What is the main job of the Battery Management System (BMS)?',
        options: [
          'Cooling the cabin',
          'Monitoring and protecting cells, including balancing and temperature control',
          'Converting AC to DC for the motor',
          'Charging the 12 V battery only'
        ],
        answer: 1
      },
      {
        id: 'bat-q2',
        question: 'State of Health (SoH) is best described as:',
        options: [
          'Current pack temperature',
          'Current usable capacity compared with original capacity',
          'Number of charge cycles completed',
          'Voltage of the 12 V auxiliary battery'
        ],
        answer: 1
      },
      {
        id: 'bat-q3',
        question: 'Insulation resistance testing is used to:',
        options: [
          'Measure motor torque',
          'Check HV conductors are isolated from the vehicle chassis',
          'Measure the 12 V battery\'s cranking power',
          'Test coolant flow'
        ],
        answer: 1
      },
      {
        id: 'bat-q4',
        question: 'Compared with NMC, LFP cells generally offer:',
        options: [
          'Higher energy density and lower thermal stability',
          'Longer cycle life and better thermal stability, but lower energy density',
          'Shorter cycle life and a higher nominal cell voltage',
          'Lower cost, and no need for thermal protection'
        ],
        answer: 1
      },
      {
        id: 'bat-q5',
        question: 'If a battery cell shows signs of thermal runaway, the first action is to:',
        options: [
          'Open the pack and inspect the cells',
          'Keep charging to balance the pack',
          'Evacuate the area and contact emergency services',
          'Pour water on the pack from the top'
        ],
        answer: 2
      }
    ]
  },
  {
    id: 'motor-inverter',
    title: 'Drive Motor & Inverter Troubleshooting',
    level: 'Advanced',
    hours: 6,
    passingScore: 80,
    description: 'Diagnose traction motors, inverters, rotor position sensors and resolvers, and diagnostic trouble codes in EV drive systems, with a structured approach to every fault.',
    modules: [
      {
        id: 'mot-1',
        title: 'Course Overview and Learning Outcomes',
        content: [
          'By the end of this course you will be able to: explain how an EV drive system converts battery power into motion and back again; describe the role of a resolver in a permanent magnet motor; read, record, and interpret diagnostic trouble codes (DTCs); and verify a repair before returning the vehicle to service.',
          'Recommended before starting: High-Voltage Safety & PPE. Lithium-Ion Battery Diagnostics is strongly recommended because many drive faults are linked to the battery and its contactors.',
          'How the course works: the final assessment unlocks after all four modules are complete. You need 80% (4 of 5 questions correct) to pass.',
          'References: NFPA 70E; SAE J2990; ISO 6469; and the manufacturer\'s service information for drive unit diagnostics and DTC procedures.'
        ]
      },
      {
        id: 'mot-2',
        title: 'How the Drive System Works',
        content: [
          'The inverter converts DC power from the battery into controlled three-phase AC that drives the traction motor. Its power switching devices, usually IGBTs or silicon carbide (SiC) MOSFETs, switch the current thousands of times per second under the control of the motor controller. By changing the frequency and amplitude of the AC, the controller sets the motor\'s speed and torque.',
          'Most EVs use permanent magnet synchronous motors (PMSM), which have magnets in the rotor, or induction motors, which create rotor current by induction. PMSMs are efficient over a wide speed range, but the controller needs accurate rotor position information to run them properly.',
          'Regenerative braking reverses the power flow. The motor acts as a generator, and the inverter sends energy back to the battery. A fault in the drive system can reduce power, set limp mode, or disable the vehicle, so always check for stored codes before replacing parts.'
        ]
      },
      {
        id: 'mot-3',
        title: 'Rotor Position Sensors and Resolvers',
        content: [
          'A resolver is a rotating transformer with an excitation winding and two output windings, one sine and one cosine. The controller sends the excitation signal, typically a fixed-frequency AC signal, and works out the rotor angle from the amplitude of the two outputs.',
          'Common faults include open or shorted windings, poor connector pins, damaged harness shielding, and incorrect air gap or mounting after a repair. Symptoms include reduced power, torque errors, and limp mode. Check the excitation and signal outputs against the manufacturer\'s specification, using an oscilloscope where possible.',
          'When replacing a resolver, check for alignment marks and follow the calibration procedure. Some systems need a resolver offset learning routine after replacement, and skipping it can cause poor performance or further faults.'
        ]
      },
      {
        id: 'mot-4',
        title: 'Reading and Clearing Diagnostic Trouble Codes',
        content: [
          'Diagnostic Trouble Codes (DTCs) are stored by vehicle control modules when they detect a fault. Read the codes with a scan tool that supports the EV\'s modules, and record the freeze frame data. Note whether each code is current, pending, or history, because the status changes how urgent the fault is.',
          'Work from the code to the cause. Follow the service information\'s diagnostic flow, check wiring and connectors first, and test components only after the basics pass. A code that returns after it has been cleared usually means the fault is still present.',
          'After a repair, verify the fix with a road test or a scan tool test, then clear the codes and recheck every module. Clearing a code without fixing the fault is not a repair. Some faults are logged in more than one module, so check them all.'
        ]
      }
    ],
    assessment: [
      {
        id: 'mot-q1',
        question: 'In a typical EV, the inverter converts:',
        options: [
          'AC to DC for charging the battery',
          'DC from the battery to three-phase AC for the motor',
          '12 V to 400 V for the cabin',
          'Mechanical energy into electrical energy only'
        ],
        answer: 1
      },
      {
        id: 'mot-q2',
        question: 'What does a resolver provide?',
        options: [
          'Battery temperature',
          'Rotor position for motor control',
          'Brake fluid pressure',
          'Cabin air quality'
        ],
        answer: 1
      },
      {
        id: 'mot-q3',
        question: 'Which power devices are commonly used in EV inverters?',
        options: [
          'Relays only',
          'Fuses only',
          'IGBTs or silicon carbide MOSFETs',
          'Diodes only'
        ],
        answer: 2
      },
      {
        id: 'mot-q4',
        question: 'During regenerative braking, the motor acts as:',
        options: [
          'A battery charger only',
          'A generator that sends energy back through the inverter',
          'A heater for the cabin',
          'A relay that disconnects the battery'
        ],
        answer: 1
      },
      {
        id: 'mot-q5',
        question: 'What is the correct practice after repairing a fault that set a DTC?',
        options: [
          'Clear the code and drive away',
          'Disconnect the battery to reset the system',
          'Verify the repair, then clear the codes and recheck',
          'Ignore codes that only appear intermittently'
        ],
        answer: 2
      }
    ]
  },
  {
    id: 'charging-systems',
    title: 'EV Charging Systems: AC and DC',
    level: 'Intermediate',
    hours: 5,
    passingScore: 80,
    description: 'Learn how AC and DC charging equipment works, how the vehicle and charger communicate, how the onboard charger operates, and how to diagnose charging faults safely.',
    modules: [
      {
        id: 'ch-1',
        title: 'Course Overview and Learning Outcomes',
        content: [
          'By the end of this course you will be able to: explain how AC and DC charging differ; describe the role of the onboard charger and the charge communication link; identify common connectors; and diagnose charging faults using a logical, safe sequence.',
          'Recommended before starting: High-Voltage Safety & PPE. Charging circuits carry high voltage and high current, so the isolation discipline from that course applies whenever you open a charge port or test an HV part.',
          'How the course works: the final assessment unlocks when all four modules are complete. You need 80% (4 of 5 questions correct) to pass.',
          'References: NFPA 70E; SAE J1772 (EV charging connector); IEC 61851 (conductive charging systems for electric vehicles); SAE J3400 (NACS connector); and the manufacturer\'s service information for the charging system.'
        ]
      },
      {
        id: 'ch-2',
        title: 'AC Charging and the Onboard Charger',
        content: [
          'AC charging uses the vehicle\'s onboard charger (OBC), which converts alternating current from the grid into DC for the battery. Level 1 charging uses a standard 120 V outlet in North America and adds only a few miles of range per hour. Level 2 uses 240 V, is common at homes and workplaces, and typically delivers between about 3.3 kW and 19 kW depending on the vehicle and equipment.',
          'The J1772 connector is the standard AC plug in North America. Its control pilot signal tells the vehicle how much current is available, and the vehicle\'s response tells the charging equipment that it is ready. A proximity pilot detects whether the plug is fully inserted.',
          'Onboard charger faults often appear as a reduced charge rate, no charge, or a failure to communicate. Check the supply voltage at the outlet or charging equipment first, then the charge port, the cable, and any fault codes shown by the equipment, before suspecting the vehicle.'
        ]
      },
      {
        id: 'ch-3',
        title: 'DC Fast Charging and Charge Communication',
        content: [
          'DC fast chargers convert grid AC to DC outside the vehicle and feed the battery directly, bypassing the onboard charger. This allows much higher power, often from 50 kW to over 350 kW. Common connectors include CCS (Combined Charging System), CHAdeMO, and NACS (SAE J3400), which is being adopted across North America.',
          'Before a DC session starts, the vehicle and the charger exchange messages over a communication link to agree on voltage, current limits, and insulation status. If communication fails, the session stops before current flows, so a repeated communication error is a fault to investigate, not something to ignore.',
          'Heat is the main enemy of fast charging. Check the coolant level and pump operation in liquid-cooled cables and vehicles, and inspect connectors for pitting, discolouration, or water ingress. A hot connector or a burning smell means you must stop the session and report it.'
        ]
      },
      {
        id: 'ch-4',
        title: 'Diagnosing Charging Faults Safely',
        content: [
          'Start every charging fault with a safety check. Make sure the vehicle is in park with the charge cable disconnected before you inspect the port, and look at the connector and cable for damage, scorching, or water. Do not open any HV enclosure without following the five-step isolation procedure.',
          'Use a logical sequence: confirm the supply voltage, check the charging equipment display or app for fault codes, inspect the cable and connector, examine the charge port for damage or corrosion, and then check vehicle codes with a scan tool that supports the charging modules.',
          'Record the charger model, firmware version, error messages, and the vehicle\'s state of charge and battery temperature when the fault occurred. Many charging complaints are caused by a poor connection, water in a connector, or a supply problem rather than a faulty vehicle.'
        ]
      }
    ],
    assessment: [
      {
        id: 'ch-q1',
        question: 'In an EV, which component converts AC from the grid into DC for the battery during AC charging?',
        options: [
          'Battery contactor',
          'Onboard charger',
          '12 V battery',
          'Traction motor'
        ],
        answer: 1
      },
      {
        id: 'ch-q2',
        question: 'Which connector is the standard AC charging plug in North America?',
        options: ['CHAdeMO', 'J1772', 'Type 2 only', 'CCS2 only'],
        answer: 1
      },
      {
        id: 'ch-q3',
        question: 'Why can a DC fast charger deliver much higher power than a Level 2 AC charger?',
        options: [
          'It converts AC to DC outside the vehicle and feeds the battery directly',
          'It runs at a lower voltage',
          'It charges only the 12 V battery',
          'It has no communication with the vehicle'
        ],
        answer: 0
      },
      {
        id: 'ch-q4',
        question: 'During DC fast charging, a hot connector with a burning smell should:',
        options: [
          'Be ignored if the session is nearly complete',
          'Be sprayed with water to cool it',
          'Stop the session and be reported',
          'Be cleaned while still connected'
        ],
        answer: 2
      },
      {
        id: 'ch-q5',
        question: 'Before inspecting a charge port, what should you do first?',
        options: [
          'Confirm the vehicle is in park and the charge cable is disconnected',
          'Start a charge to check the connection',
          'Remove the 12 V battery only',
          'Open the charge port while the car is charging'
        ],
        answer: 0
      }
    ]
  },
  {
    id: 'hv-wiring-repair',
    title: 'High-Voltage Wiring and Connector Repair',
    level: 'Advanced',
    hours: 5,
    passingScore: 80,
    description: 'Inspect, diagnose, and repair orange high-voltage cables, shielded wiring, and HV connectors using manufacturer-approved methods and insulation-safe techniques.',
    modules: [
      {
        id: 'hvw-1',
        title: 'Course Overview and Learning Outcomes',
        content: [
          'By the end of this course you will be able to: inspect HV cables and connectors for damage; decide whether a repair is permitted; carry out a repair using approved parts and methods; and test and document the repaired circuit before returning it to service.',
          'Recommended before starting: High-Voltage Safety & PPE. Lithium-Ion Battery Diagnostics is recommended, because many wiring faults show up as battery or isolation fault codes.',
          'How the course works: the final assessment unlocks when all four modules are complete. You need 80% (4 of 5 questions correct) to pass.',
          'References: NFPA 70E; ISO 6469; SAE J2990; and the manufacturer\'s repair procedures and approved parts lists.'
        ]
      },
      {
        id: 'hvw-2',
        title: 'Inspecting HV Cables and Connectors',
        content: [
          'HV cables use thicker insulation and shielding to carry high current safely and to limit electromagnetic interference. Orange sheathing marks an HV circuit. Many cables have a shield that must stay continuous, and the shield is grounded at specific points defined by the design.',
          'Inspect the outer sheath for cuts, abrasion, cracks, and melted areas. Check connectors for bent or pushed-back pins, cracked housings, corrosion, moisture, and loose or missing seals. Discolouration or a melted smell at a connector suggests high resistance, which generates heat.',
          'Check the full cable route, not just the visible section near the fault. A cable that is pinched, stretched, or chafed against a bracket can fail intermittently, and it may only show a fault when the suspension moves or the vehicle heats up.'
        ]
      },
      {
        id: 'hvw-3',
        title: 'Repair Methods and Approved Parts',
        content: [
          'Repair an HV cable only when the manufacturer permits it, and only with approved parts. Many manufacturers require replacement of the complete harness rather than a splice. When a splice is allowed, use the specified splice kit, which includes the correct cable gauge, insulation sleeves, and shield continuity components.',
          'Use the calibrated crimp tool and terminal the manufacturer specifies. A poor crimp increases resistance, generates heat, and can cause arcing. Check each crimp visually against the reference profile and confirm it with a pull test where the procedure requires one. Never use standard automotive wire or household connectors in an HV circuit.',
          'Apply heat shrink and seals exactly as specified to keep moisture out. Insulation sleeves must cover all exposed conductor and shield. Document every repair with photographs, part numbers, and test results.'
        ]
      },
      {
        id: 'hvw-4',
        title: 'Testing and Returning the Vehicle to Service',
        content: [
          'After any HV repair, carry out an insulation resistance test on the repaired circuit before re-energising the system. Measure the repaired conductors to chassis and confirm that the resistance matches the manufacturer\'s specification.',
          'Re-energise the system by reversing the five-step procedure in the correct order. Remove tags and locks only when all tools are accounted for and everyone is clear of the work area.',
          'Finally, run the vehicle\'s self-test or a road test, scan every module for codes, and clear codes only after confirming the repair. Give the customer a written record of the repair, including any parts that were replaced.'
        ]
      }
    ],
    assessment: [
      {
        id: 'hvw-q1',
        question: 'Orange sheathing on an EV cable usually indicates:',
        options: [
          'A low-voltage signal wire',
          'A high-voltage circuit',
          'A coolant line',
          'A ground strap only'
        ],
        answer: 1
      },
      {
        id: 'hvw-q2',
        question: 'Why is a poor crimp dangerous in an HV circuit?',
        options: [
          'It increases resistance, causing heat and possible arcing',
          'It makes the cable lighter',
          'It has no effect on current flow',
          'It only affects the radio'
        ],
        answer: 0
      },
      {
        id: 'hvw-q3',
        question: 'When is a splice in an HV cable allowed?',
        options: [
          'Whenever the cable is damaged',
          'Only when the manufacturer permits it, using the specified kit',
          'Whenever the vehicle is out of warranty',
          'Never, under any circumstances'
        ],
        answer: 1
      },
      {
        id: 'hvw-q4',
        question: 'What must be checked before re-energising a repaired HV circuit?',
        options: [
          'Only the paint colour of the cable',
          'Insulation resistance and the circuit resistance against specification',
          'Nothing, if the cable looks new',
          'Only the 12 V battery voltage'
        ],
        answer: 1
      },
      {
        id: 'hvw-q5',
        question: 'Which tool should be used to make an HV crimp?',
        options: [
          'Any pair of pliers',
          'A calibrated crimp tool specified by the manufacturer',
          'A hammer and punch',
          'Wire cutters only'
        ],
        answer: 1
      }
    ]
  }
];

module.exports = COURSES;