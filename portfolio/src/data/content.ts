export type Category = 'SOC & detection' | 'Security tools' | 'Labs & research' | 'Web development';
export type Evidence = { label: string; url: string };
export type Project = {
  slug: string;
  title: string;
  shortTitle?: string;
  category: Category;
  eyebrow: string;
  tagline: string;
  summary: string;
  stack: string[];
  repo?: string;
  demo?: string;
  image?: string;
  imageCaption?: string;
  visual: 'astra' | 'agent' | 'siem' | 'url' | 'password' | 'web' | 'research' | 'workflow';
  featured?: boolean;
  overview: string;
  capabilities: string[];
  workflow: { title: string; text: string }[];
  boundary: string;
  evidence: Evidence[];
  finding?: { value: string; label: string; context: string };
};

const gh = 'https://github.com/jeff-1217';
const live = 'https://www.jeffsec.in';
const repo = (name: string) => `${gh}/${name}`;
const blob = (name: string, path: string) => `${gh}/${name}/blob/main/${path}`;

export const profile = {
  name: 'Jefrine Correya',
  role: 'SOC Analyst & Cybersecurity Professional',
  location: 'Doha, Qatar',
  city: 'Doha',
  country: 'Qatar',
  timeZone: 'Asia/Qatar',
  timeZoneLabel: 'AST',
  latitude: 25.2854,
  longitude: 51.5310,
  email: 'jefrincorreya@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jefrine07',
  github: gh,
  site: live,
  resume: '/documents/jefrine-correya-resume.pdf',
  experience: '1+',
  languages: ['Malayalam', 'English', 'Kannada', 'Tamil'],
  bio: 'I’m Jefrine Correya, an EC-Council Certified SOC Analyst (CSA v1) based in Doha, Qatar. I work at the intersection of security operations, web application testing, and automation—turning logs and alerts into context that helps people respond.',
  longBio: [
    'I’m an EC-Council Certified SOC Analyst (CSA v1) with hands-on experience in security monitoring, alert triage, log analysis, and incident response support. My focus is on understanding the signal behind an alert, investigating it carefully, and making the next action clear.',
    'I hold a Bachelor of Computer Applications from Koshys Institute of Management Studies, Bangalore North University. I completed my CICSA training at RedTeam Hacker Academy in Kochi, building practical experience in SOC workflows, network analysis, and web security.',
    'At Wahy Lab Solutions, I worked as a Junior Cyber Security Analyst, focusing on security monitoring, alert triage, and incident investigation. Alongside that experience, I build SIEM labs, phishing detection tools, and AI-assisted investigation workflows. Continuous learning, clear communication, and thoughtful automation are central to how I work.',
  ],
};

export const certifications = [
  { id: 'csa', acronym: 'CSA', title: 'Certified SOC Analyst v1', issuer: 'EC-Council', date: 'July 2025', status: 'Earned', description: 'Security operations, threat detection, log analysis, and incident response. The original EC-Council certificate is available to preview.', topics: ['Security operations', 'Threat detection', 'Incident response', 'Log analysis'] },
  { id: 'cicsa', acronym: 'CICSA', title: 'Certified IT Infrastructure & Cyber SOC Analyst', issuer: 'RedTeam Hacker Academy', date: 'July 2025', status: 'Earned', description: 'Completed practical training in SOC operations and web security at RedTeam Hacker Academy, Kochi, from February to July 2025.', topics: ['SOC workflows', 'Vulnerability assessment', 'Network analysis', 'Web security'] },
  { id: 'security-plus', acronym: 'Sec+', title: 'CompTIA Security+', issuer: 'CompTIA', date: 'In progress', status: 'Pursuing', description: 'Previously listed as pursuing in the earlier résumé. Kept separate from the two earned qualifications; this is not an earned certification.', topics: ['Continuous learning', 'Security fundamentals'] },
];

export const journey = [
  { period: 'SEP 2025 — MAY 2026', title: 'Jr Cyber Security Analyst', subtitle: 'Wahy Lab Solutions · SOC Operations', location: 'On-site · Kochi, Kerala', kind: 'Experience', details: ['Monitored, triaged, and investigated security alerts using Splunk and Wazuh.', 'Reviewed log telemetry and indicators of compromise, with MITRE ATT&CK context.', 'Used Python triage scripts to enrich incoming IP and URL indicators with threat intelligence.', 'Documented incident timelines, evidence, and mitigation steps for escalated tickets.'] },
  { period: 'FEB — JUL 2025', title: 'CICSA training', subtitle: 'RedTeam Hacker Academy', location: 'Kochi, Kerala', kind: 'Training', details: ['Practical SOC operations and web security training: alert triage, threat monitoring, vulnerability assessment, and incident handling.', 'Hands-on work with Splunk, Wazuh, Burp Suite, Wireshark, Nmap, Metasploit, and vulnerability scanners.', 'Lab exposure to cyberattack scenarios and response techniques.'] },
  { period: 'OCT 2021 — AUG 2024', title: 'Bachelor of Computer Applications', subtitle: 'Koshys Institute of Management Studies', location: 'Bangalore North University · Bengaluru, Karnataka', kind: 'Education', details: ['Completed a BCA, building a foundation in computer applications and software development.', 'The starting point for a learning journey spanning web applications, networking, and cybersecurity.'] },
];

export type SkillGroup = { id: string; name: string; headline: string; description: string; skills: { name: string; level?: string }[]; proof: string };
export const skillGroups: SkillGroup[] = [
  { id: 'detect', name: 'Detect & respond', headline: 'Make the logs tell a story.', description: 'Security monitoring, incident triage, and contextual investigation with SIEM tools and threat intelligence.', proof: 'splunk-soc-lab', skills: [
    { name: 'Splunk', level: 'Advanced' }, { name: 'Wazuh (SIEM)', level: 'Advanced' }, { name: 'Elastic Stack', level: 'Experienced' }, { name: 'Security Incident Response', level: 'Experienced' }, { name: 'Threat Intelligence & Detection', level: 'Experienced' }, { name: 'Alert Monitoring' }, { name: 'Incident Triage' }, { name: 'Log Analysis' },
  ] },
  { id: 'assess', name: 'Assess & test', headline: 'Understand the attack surface.', description: 'Web application testing, reconnaissance, and vulnerability assessment, with an emphasis on authorised environments.', proof: 'web-vulnerability-scanner', skills: [
    { name: 'OWASP', level: 'Advanced' }, { name: 'Penetration Testing', level: 'Experienced' }, { name: 'Vulnerability Assessment', level: 'Experienced' }, { name: 'API Testing', level: 'Intermediate' }, { name: 'SQL Injection', level: 'Intermediate' }, { name: 'XSS', level: 'Intermediate' }, { name: 'Nessus', level: 'Intermediate' }, { name: 'Burp Suite' }, { name: 'Nmap' }, { name: 'Metasploit' }, { name: 'OSINT Tools' }, { name: 'WPScan' }, { name: 'Nikto' },
  ] },
  { id: 'build', name: 'Build & automate', headline: 'Let the workflow do the heavy lifting.', description: 'Web development, Python automation, and machine-learning experiments that support security investigation.', proof: 'soc-threat-detection-assistant', skills: [
    { name: 'Python', level: 'Intermediate' }, { name: 'HTML', level: 'Intermediate' }, { name: 'CSS', level: 'Experienced' }, { name: 'JavaScript', level: 'Basic' }, { name: 'MySQL', level: 'Experienced' }, { name: 'PHP', level: 'Experienced' }, { name: 'C#', level: 'Basic' }, { name: '.NET', level: 'Intermediate' }, { name: 'Scikit-learn' }, { name: 'Isolation Forest' }, { name: 'Random Forest' }, { name: 'n8n' }, { name: 'CrewAI' },
  ] },
  { id: 'network', name: 'Networks & systems', headline: 'Follow the packet. Find the context.', description: 'Network traffic analysis and operating-system fundamentals underpin every useful security investigation.', proof: 'wireshark-traffic-analysis', skills: [
    { name: 'Wireshark' }, { name: 'Network Traffic Analysis' }, { name: 'OSI Model' }, { name: 'TCP/IP' }, { name: 'Networking Protocols' }, { name: 'Firewalls' }, { name: 'IDS / IPS' }, { name: 'VPN' }, { name: 'Windows' }, { name: 'Kali Linux' }, { name: 'macOS' },
  ] },
];
export const softSkills = ['Problem solving', 'Teamwork', 'Communication', 'Continuous learning'];

export const projects: Project[] = [
  {
    slug: 'astra-monitor', title: 'ASTRA Monitor', category: 'SOC & detection', eyebrow: 'THREAT RECOGNITION & ANALYSIS',
    tagline: 'The whole threat picture. One clear view.',
    summary: 'A simulated next-generation SIEM dashboard for threat detection, triage, and incident response workflows.',
    stack: ['Python', 'Flask', 'Socket.IO', 'Scikit-learn', 'JavaScript'], repo: repo('ASTRA-Monitor'), image: '/images/astra.webp', imageCaption: 'Original project illustration from the live portfolio. Not a production dashboard or measured detection result.', visual: 'astra', featured: true,
    overview: 'AI-based Security Threat Recognition and Analysis (ASTRA) explores how a modern SOC can make security activity understandable. Its documented dashboard streams simulated network events, classifies severity, maps adversary behaviour to MITRE ATT&CK, and tracks an incident from New to In Progress to Closed.',
    capabilities: ['Real-time simulated traffic and anomaly visualisation.', 'Critical, High, Medium, and Low severity classifications.', 'MITRE ATT&CK context, including T1110 (Brute Force) and T1046 (Network Service Discovery / port scanning).', 'Simulated response playbooks for blocking IPs, escalation, and endpoint quarantine.', 'Traffic charts, a threat radar, and a 3D threat-origin globe.', 'A separate model-training pipeline using Isolation Forest and Random Forest.'],
    workflow: [{ title: 'Generate the signal', text: 'A custom mock-data generator creates network events and attack patterns for the dashboard.' }, { title: 'Add context', text: 'Events carry severity, source reputation, geolocation, and MITRE ATT&CK technique context in the simulation.' }, { title: 'Track the response', text: 'Incident status and simulated playbooks illustrate triage and response—not real firewall enforcement.' }],
    boundary: 'This is a SOC simulation and learning project. Response actions and dashboard telemetry are simulated. The repository contains model-training code, but no production detection accuracy or deployment claim is made here.',
    evidence: [{ label: 'Project documentation', url: blob('ASTRA-Monitor', 'README.md') }, { label: 'Flask application', url: blob('ASTRA-Monitor', 'app.py') }, { label: 'ML training pipeline', url: blob('ASTRA-Monitor', 'trainmodel.py') }],
  },
  {
    slug: 'soc-threat-detection-assistant', title: 'SOC Threat Detection Assistant', shortTitle: 'SOC Threat Assistant', category: 'SOC & detection', eyebrow: 'AI-ASSISTED INVESTIGATION',
    tagline: 'From raw logs to a clearer next step.', summary: 'An AI-assisted log investigation workflow combining threat intelligence, behavioural checks, and actionable reporting.',
    stack: ['Python', 'CrewAI', 'Groq / Llama 3.3', 'AbuseIPDB', 'VirusTotal', 'GeoIP'], repo: repo('SOC-Threat-Detection-Assistant'), demo: 'https://mxefvetxcpbwk8zjk4vpra.streamlit.app/', image: '/images/soc-assistant.webp', imageCaption: 'Original SOC assistant cover / interface image from the existing portfolio.', visual: 'agent', featured: true,
    overview: 'The assistant takes firewall logs and builds an investigation around the IP addresses inside them. It connects reputation data, repeated-failure patterns, and geolocation context, then uses Groq’s Llama-3.3-70b model to summarise the findings and suggest whether to block or monitor.',
    capabilities: ['Extracts IP addresses from firewall logs with regular expressions.', 'Enriches suspicious IPs through AbuseIPDB and VirusTotal.', 'Looks for repeated SSH / HTTP authentication failures.', 'Adds country, city, and ISP context through IP-API / GeoIP services.', 'Generates structured investigation summaries and an HTML report.', 'CrewAI agent architecture is documented in the README and résumé; a Streamlit interface is linked from the existing site.'],
    workflow: [{ title: 'Parse', text: 'Read firewall logs and extract the IPs that need investigation.' }, { title: 'Enrich & investigate', text: 'Combine AbuseIPDB, VirusTotal, behaviour checks, and geolocation into contextual evidence.' }, { title: 'Report', text: 'Use Groq to synthesise findings into a recommendation, then write an investigation report for review.' }],
    boundary: 'The README describes a CrewAI architecture; the current public soc_agent.py also implements a direct, sequential Python investigation pipeline. Recommendations are AI-assisted and require analyst review. External APIs need credentials; this portfolio does not call them.',
    evidence: [{ label: 'Architecture & documentation', url: blob('SOC-Threat-Detection-Assistant', 'README.md') }, { label: 'Public Python implementation', url: blob('SOC-Threat-Detection-Assistant', 'soc_agent.py') }, { label: 'Streamlit implementation', url: repo('-soc-agent-streamlit') }],
  },
  {
    slug: 'splunk-soc-lab', title: 'Splunk SOC Lab', category: 'Labs & research', eyebrow: 'CENTRALISED SECURITY MONITORING',
    tagline: 'Follow the log. Surface the threat.', summary: 'A hands-on Splunk environment for log ingestion, SSH brute-force detection, and SOC alerting.',
    stack: ['Splunk Enterprise', 'Universal Forwarder', 'Ubuntu', 'Kali Linux', 'SPL'], repo: repo('splunk-soc-lab'), image: '/images/splunk.webp', imageCaption: 'Dashboard mockup published in the lab repository. The displayed counts are illustrative lab values, not portfolio performance metrics.', visual: 'siem', featured: true,
    overview: 'A Windows-based Splunk Enterprise instance receives Ubuntu system logs through the Splunk Universal Forwarder over TCP 9997. A controlled Kali Linux attacker produces SSH password-guessing activity, allowing ingestion, searches, and real-time alerting to be examined end to end.',
    capabilities: ['Hub-and-spoke SIEM architecture with a Windows server and Ubuntu endpoint.', 'Forwarding /var/log/auth.log and /var/log/syslog.', 'SPL searches for failed authentication and repeated SSH login failures.', 'Source-IP and targeted-account investigation.', 'Alert configuration, monitored-input checks, and detection playbooks.', 'A published project report and architecture diagram.'],
    workflow: [{ title: 'Collect', text: 'Ship Ubuntu authentication and system logs through the Universal Forwarder to Splunk Enterprise.' }, { title: 'Correlate', text: 'Search failed passwords and group repeated events to identify the lab attacker and targeted accounts.' }, { title: 'Alert', text: 'Save the search as an alert and verify monitoring and ingestion status.' }],
    boundary: 'All attack activity is in a controlled lab. Dashboard images in the repository are labelled mockups. No enterprise-scale monitoring, production incident volume, or detection-rate claim is made.',
    evidence: [{ label: 'Lab architecture & documentation', url: blob('splunk-soc-lab', 'README.md') }, { label: 'Detection searches', url: blob('splunk-soc-lab', 'queries/splunk-searches.md') }, { label: 'Detection playbooks', url: blob('splunk-soc-lab', 'detections/use-cases.md') }, { label: 'Full SOC report', url: blob('splunk-soc-lab', 'reports/Jefrin_Final_SOC_Report.pdf') }],
    finding: { value: 'TCP 9997', label: 'Log-forwarding port', context: 'A documented configuration detail from the lab—not a performance statistic.' },
  },
  {
    slug: 'url-phishing-detector', title: 'URL Phishing Detector', category: 'Security tools', eyebrow: 'SAFER LINKS, BETTER CONTEXT',
    tagline: 'Inspect the link before the click.', summary: 'A Flask-based URL analysis tool combining lexical features with Google Safe Browsing verdicts.',
    stack: ['Python', 'Flask', 'Google Safe Browsing API', 'HTML', 'CSS', 'JavaScript'], repo: repo('URL-Phishing-Detector2'), demo: 'https://url-phishing-detector2-z3ha.vercel.app/', image: '/images/phishing-detector.webp', imageCaption: 'Original URL Phishing Detector project cover from the existing portfolio.', visual: 'url', featured: true,
    overview: 'Users submit a URL for two complementary checks: a lexical analysis of the URL itself, and a Google Safe Browsing lookup for malware or social-engineering matches. The result presents the lexical findings alongside the API’s threat verdict.',
    capabilities: ['A browser-based URL submission interface.', 'Lexical URL feature analysis in a dedicated Python module.', 'Google Safe Browsing checks for malware and social engineering.', 'Displays threat matches and the Safe Browsing result.', 'Python / Flask backend with a HTML, CSS, and JavaScript interface.'],
    workflow: [{ title: 'Submit', text: 'Accept a URL through the Flask application form.' }, { title: 'Analyse', text: 'Calculate lexical signals and ask the Google Safe Browsing API for known threat matches.' }, { title: 'Explain', text: 'Present both checks together so the user can evaluate the result with context.' }],
    boundary: 'A clean API verdict is not a guarantee that a link is safe. Threat databases can miss new threats. The original and version-two repositories are preserved in the public repository index. No URLs are submitted or scanned by this portfolio.',
    evidence: [{ label: 'Flask implementation', url: blob('URL-Phishing-Detector2', 'app.py') }, { label: 'Lexical analysis module', url: blob('URL-Phishing-Detector2', 'lexical.py') }, { label: 'Original repository', url: repo('url-phishing-detector') }],
  },
  {
    slug: 'wazuh-siem-lab', title: 'Wazuh SIEM Lab', category: 'Labs & research', eyebrow: 'ENDPOINT TELEMETRY & THREAT HUNTING',
    tagline: 'A small lab. A complete detection story.', summary: 'A virtualised Wazuh environment for endpoint monitoring and SSH brute-force alert investigation.',
    stack: ['Wazuh', 'Ubuntu', 'Linux', 'SSH', 'SIEM'], repo: repo('wazuh-siem-lab'), image: '/images/wazuh.webp', imageCaption: 'Stylized lab cover illustration published in the repository, not used as genuine UI evidence. The project film uses actual screenshots embedded in the original report.', visual: 'siem',
    overview: 'A central Wazuh Manager monitors an Ubuntu client agent. Controlled SSH login attempts generate authentication telemetry, which is decoded and mapped to detection rules in the Wazuh dashboard.',
    capabilities: ['Centralised Linux event aggregation and analysis.', 'Agent enrolment, endpoint-health summaries, and monitoring.', 'SSH authentication failure investigations.', 'Rule 5710: invalid-user login attempt, level 5.', 'Rule 5716: SSHD authentication failure, level 5.', 'Rule 5720: multiple SSHD authentication failures, level 10.'],
    workflow: [{ title: 'Deploy', text: 'Build the Wazuh server, enrol an Ubuntu agent, and verify endpoint visibility.' }, { title: 'Simulate', text: 'Generate SSH brute-force activity against the authorised lab target.' }, { title: 'Investigate', text: 'Trace the resulting alerts through the threat-hunting view and compare rule IDs and severity.' }],
    boundary: 'This is an authorised, virtualised lab rather than a managed production SOC. Published rule IDs and severity levels are lab documentation facts.',
    evidence: [{ label: 'Lab documentation', url: blob('wazuh-siem-lab', 'README.md') }, { label: 'Installation & lab commands', url: blob('wazuh-siem-lab', 'commands/installation-commands.md') }, { label: 'Full Wazuh project report', url: blob('wazuh-siem-lab', 'report/PROJECT_ON_WAZUH.pdf') }],
    finding: { value: '5720', label: 'Multiple SSH authentication failures', context: 'The lab documents Wazuh rule 5720 at severity level 10.' },
  },
  {
    slug: 'web-vulnerability-scanner', title: 'Web Vulnerability Scanner', category: 'Security tools', eyebrow: 'RECONNAISSANCE & ASSESSMENT',
    tagline: 'Make the attack surface visible.', summary: 'A Flask interface for Nmap-based port, service, and vulnerability reconnaissance.',
    stack: ['Python', 'Flask', 'Nmap', 'HTML', 'TailwindCSS'], repo: repo('web-vuln-scanner'), demo: 'https://web-vuln-scanner-cyan.vercel.app', image: '/images/vulnerability-scanner.webp', imageCaption: 'Original scanner project illustration from the existing portfolio.', visual: 'web',
    overview: 'The scanner turns Nmap output into a structured browser-based view. The public scanner.py defines several scan profiles and extracts port, protocol, state, service, operating-system, and vulnerability information from scan results.',
    capabilities: ['Basic, comprehensive, vulnerability-focused, stealth, and full Nmap profiles.', 'Hostname cleaning and DNS resolution before a scan.', 'Port and service enumeration.', 'Nmap vulnerability-script findings and operating-system details.', 'Structured scan results with timestamps and raw output.', 'A five-minute subprocess timeout and error reporting.'],
    workflow: [{ title: 'Scope', text: 'Provide a target that you own or have explicit permission to assess.' }, { title: 'Scan', text: 'Select an Nmap profile and execute the scan from the Flask backend.' }, { title: 'Review', text: 'Parse and present open ports, services, OS information, and reported vulnerability findings.' }],
    boundary: 'Only use this tool on authorised targets. An Nmap scan is not a comprehensive application penetration test. This portfolio never initiates scans; the existing external demo may depend on server-side Nmap availability.',
    evidence: [{ label: 'Scanner implementation', url: blob('web-vuln-scanner', 'scanner.py') }, { label: 'Flask application', url: blob('web-vuln-scanner', 'app.py') }],
  },
  {
    slug: 'passchecker', title: 'PassChecker', category: 'Security tools', eyebrow: 'PASSWORD HYGIENE',
    tagline: 'Better passwords, one useful cue at a time.', summary: 'A real-time password strength checker that gives clear feedback on password complexity.',
    stack: ['HTML', 'CSS', 'JavaScript'], repo: repo('password_strength_checker'), demo: 'https://password-strength-checker-alpha.vercel.app/', image: '/images/passchecker.webp', imageCaption: 'Original PassChecker cover from the existing portfolio.', visual: 'password',
    overview: 'PassChecker helps users understand how password length, character variety, and patterns affect a strength assessment. The browser interface updates feedback as a password is entered.',
    capabilities: ['Real-time password-strength feedback.', 'Length and character-variety checks.', 'A visual strength indicator and practical guidance.', 'A standalone web interface built with HTML, CSS, and JavaScript.', 'A related password security analysis report.'],
    workflow: [{ title: 'Enter', text: 'Type a sample password into the checker.' }, { title: 'Evaluate', text: 'Apply client-side complexity checks to its length and character mix.' }, { title: 'Improve', text: 'Use the feedback to choose a longer, more varied, unique password.' }],
    boundary: 'A complexity score is a heuristic, not a guarantee against compromise. Use a password manager and unique passwords, and enable MFA. This portfolio does not ask for, collect, or evaluate real passwords.',
    evidence: [{ label: 'Password checker source', url: blob('password_strength_checker', 'index.html') }, { label: 'Password analysis & report', url: repo('password-security-analysis') }],
  },
  {
    slug: 'slms', title: 'Student Leave Management System', shortTitle: 'SLMS', category: 'Web development', eyebrow: 'WORKFLOW DESIGN',
    tagline: 'Less paperwork. A clearer approval flow.', summary: 'A student leave-request and approval prototype for educational institutions.',
    stack: ['React', 'TypeScript', 'Vite', 'Recharts'], repo: repo('student-leave-management-system'), demo: 'https://student-leave-management-system-eta.vercel.app', image: '/images/slms.webp', imageCaption: 'Original SLMS project cover from the existing portfolio.', visual: 'workflow',
    overview: 'SLMS provides student and administrator views for a leave-management workflow. Students can submit and review requests; administrators can review requests, change statuses, and inspect summary statistics.',
    capabilities: ['Student and administrator dashboard views.', 'Leave application and status tracking.', 'Administrator approval and rejection workflows.', 'Leave summaries and trend charts.', 'A typed React interface and mock API layer.'],
    workflow: [{ title: 'Request', text: 'A student submits dates, a leave type, and a reason.' }, { title: 'Review', text: 'The administrator reviews the request and updates its status.' }, { title: 'Track', text: 'Both dashboards reflect request history, status badges, and summary statistics.' }],
    boundary: 'The public version is a prototype. Its mockApi.ts uses in-memory sample users and leave requests, not production student records or a real authentication backend.',
    evidence: [{ label: 'Application repository', url: repo('student-leave-management-system') }, { label: 'Mock API implementation', url: blob('student-leave-management-system', 'services/mockApi.ts') }, { label: 'Dependencies', url: blob('student-leave-management-system', 'package.json') }],
  },
  {
    slug: 'netflix-clone', title: 'Netflix Clone', category: 'Web development', eyebrow: 'FRONTEND EXPLORATION',
    tagline: 'Recreating a familiar browsing experience.', summary: 'A static Netflix-inspired interface exploring movie browsing, search, and modern web UI.',
    stack: ['HTML', 'CSS', 'JavaScript'], repo: repo('Netflix-clone'), demo: 'https://nxcl.netlify.app', image: '/images/netflix.webp', imageCaption: 'Original Netflix Clone project cover from the existing portfolio.', visual: 'web',
    overview: 'A static web-development exercise recreating a familiar entertainment interface. The existing portfolio describes movie browsing, search, and a modern web UI as its focus.',
    capabilities: ['Static Netflix-inspired layout.', 'Movie-browsing and search UI described on the existing portfolio.', 'A web-technologies exercise in page structure and styling.'],
    workflow: [{ title: 'Structure', text: 'Recreate the page hierarchy and familiar content layout.' }, { title: 'Style', text: 'Build a recognisable interface with web technologies.' }, { title: 'Explore', text: 'Use the exercise to practise frontend development and visual implementation.' }],
    boundary: 'A learning project, not a streaming service. It is not affiliated with Netflix and does not claim licensed streaming content or a production backend.',
    evidence: [{ label: 'Public source repository', url: repo('Netflix-clone') }, { label: 'Original project description', url: `${live}/#projects` }],
  },
  {
    slug: 'ml-threat-monitor', title: 'ML Threat Monitor', category: 'SOC & detection', eyebrow: 'ANOMALY DETECTION',
    tagline: 'Look for the behaviour that does not belong.', summary: 'A résumé-documented machine-learning project for anomalous log and network behaviour.',
    stack: ['Python', 'Flask', 'Scikit-learn', 'Isolation Forest', 'TailwindCSS'], visual: 'astra',
    overview: 'The current public résumé describes an anomaly-detection system for log and network analysis that identifies suspicious behaviour patterns and generates SOC monitoring alerts.',
    capabilities: ['Log and network behaviour analysis.', 'Anomaly detection using Scikit-learn and Isolation Forest.', 'SOC monitoring alert generation.', 'A Python / Flask interface with TailwindCSS, as listed in the résumé.'],
    workflow: [{ title: 'Observe', text: 'Use log and network data as the monitoring input.' }, { title: 'Detect', text: 'Apply an anomaly-detection model to identify unusual behaviour.' }, { title: 'Alert', text: 'Surface suspicious patterns for SOC investigation.' }],
    boundary: 'This project is documented in the résumé. A separate repository or public benchmark is not linked there, so no repository, accuracy score, or production claim is invented for it.',
    evidence: [{ label: 'Current public résumé', url: `${live}/assets/jeffresume%20.pdf` }],
  },
  {
    slug: 'ioc-automation-pipeline', title: 'IOC Automation Pipeline', category: 'SOC & detection', eyebrow: 'THREAT INTELLIGENCE ORCHESTRATION',
    tagline: 'One suspicious IP. A connected investigation.', summary: 'An n8n workflow for indicator enrichment, analyst notifications, case creation, and SIEM updates.',
    stack: ['n8n', 'AbuseIPDB', 'VirusTotal', 'AlienVault OTX', 'TheHive', 'Wazuh Cloud'], repo: repo('IOC-Automation-Pipeline'), visual: 'agent',
    overview: 'The documented pipeline fetches suspicious IPs from AbuseIPDB, enriches them through VirusTotal, AlienVault OTX, and Whois, then routes the resulting intelligence to analysts and security systems.',
    capabilities: ['Fetch IP blacklist data through AbuseIPDB.', 'Enrich indicators with VirusTotal, AlienVault OTX, and Whois.', 'Aggregate and tag threats and suspicious indicators.', 'Send Slack and HTML email notifications.', 'Create incident cases in TheHive.', 'Update Wazuh Cloud with enriched IOCs.'],
    workflow: [{ title: 'Fetch & enrich', text: 'Gather IPs, then combine multiple threat-intelligence sources.' }, { title: 'Tag & notify', text: 'Aggregate the findings, tag the indicator, and notify analysts by Slack and email.' }, { title: 'Connect the response', text: 'Create TheHive cases and push the enriched indicators into Wazuh Cloud.' }],
    boundary: 'The public README documents the workflow and reports an approximate reduction in manual effort. That is an author-reported estimate, not an independently benchmarked production result.',
    evidence: [{ label: 'Workflow & author-reported outcome', url: blob('IOC-Automation-Pipeline', 'README.md') }],
    finding: { value: '~80%', label: 'Less manual IOC triage effort', context: 'Author-reported estimate in the repository README; not independently benchmarked.' },
  },
  {
    slug: 'wireshark-traffic-analysis', title: 'Wireshark Network Traffic Analysis', category: 'Labs & research', eyebrow: 'PACKET-LEVEL INVESTIGATION',
    tagline: 'The evidence is in the packet.', summary: 'A documented packet-capture analysis with protocol findings, security observations, and a written report.',
    stack: ['Wireshark', 'PCAPNG', 'Network analysis'], repo: repo('wireshark-network-traffic-analysis'), visual: 'siem',
    overview: 'This repository publishes a network traffic capture, a Wireshark analysis report, and visual documentation. The report covers traffic patterns, protocol analysis, security observations, performance metrics, and recommendations.',
    capabilities: ['A published PCAPNG capture for further inspection.', 'Network-flow and protocol analysis.', 'Security observations and traffic-pattern documentation.', 'A PDF report with methodology, findings, and recommendations.'],
    workflow: [{ title: 'Capture', text: 'Use the published packet capture as the raw evidence.' }, { title: 'Inspect', text: 'Explore packets, protocols, and network flows in Wireshark.' }, { title: 'Document', text: 'Record observations and recommendations in the analysis report.' }],
    boundary: 'The portfolio summarises the published project; it does not expose a live packet capture or claim production network monitoring.',
    evidence: [{ label: 'Capture, report & documentation', url: repo('wireshark-network-traffic-analysis') }],
  },
  {
    slug: 'phishing-email-analysis', title: 'Phishing Email Analysis', category: 'Labs & research', eyebrow: 'EMAIL FORENSICS',
    tagline: 'Question the message. Follow the headers.', summary: 'A phishing investigation documenting social-engineering indicators and email-header evidence.',
    stack: ['Email header analysis', 'Phishing investigation', 'Evidence reporting'], repo: repo('phishing-email-analysis'), visual: 'url',
    overview: 'A detailed phishing email investigation with a PDF report and supporting evidence images. The documentation focuses on social-engineering techniques, header forensics, suspicious-message indicators, and reporting.',
    capabilities: ['Social-engineering indicator analysis.', 'Email-header forensics.', 'Evidence screenshots and documentation.', 'A full written phishing-analysis report.'],
    workflow: [{ title: 'Examine', text: 'Identify suspicious content and social-engineering cues in the message.' }, { title: 'Trace', text: 'Review headers and supporting evidence for phishing indicators.' }, { title: 'Report', text: 'Document the evidence and explanation in a shareable report.' }],
    boundary: 'A documented analysis project, not a live email-filtering service.',
    evidence: [{ label: 'Analysis & evidence', url: repo('phishing-email-analysis') }, { label: 'Full phishing report', url: blob('phishing-email-analysis', 'Phishing-Email-Analysis.pdf') }],
  },
  {
    slug: 'nessus-vulnerability-scan', title: 'Nessus Vulnerability Scan', category: 'Labs & research', eyebrow: 'RISK ASSESSMENT & REPORTING',
    tagline: 'Find the weakness. Explain the risk.', summary: 'A Nessus assessment exercise focused on scan configuration, findings, and remediation priorities.',
    stack: ['Tenable Nessus', 'Vulnerability assessment', 'Security reporting'], repo: repo('nessus-vulnerability-scan'), visual: 'web',
    overview: 'A practical vulnerability-assessment project demonstrating Nessus scan setup and result interpretation. Its sample report documents host findings, severity classifications, plugin details, CVE references, and remediation guidance.',
    capabilities: ['Scan-template and target configuration.', 'Interpretation of vulnerability findings and severity.', 'Host analysis and plugin / CVE context.', 'Risk prioritisation and remediation recommendations.', 'A sample scan report published in the repository.'],
    workflow: [{ title: 'Configure', text: 'Choose a Nessus template and define the authorised scan scope.' }, { title: 'Assess', text: 'Run the scan and review host-level vulnerability findings.' }, { title: 'Prioritise', text: 'Document risk and practical remediation guidance.' }],
    boundary: 'A lab assessment and sample report. No unverified vulnerability count or client impact is claimed.',
    evidence: [{ label: 'Assessment documentation', url: repo('nessus-vulnerability-scan') }, { label: 'Sample scan report', url: blob('nessus-vulnerability-scan', 'Vuln_Scan_Report.pdf') }],
  },
  {
    slug: 'network-portscan', title: 'Cybersecurity Portscan Project', category: 'Labs & research', eyebrow: 'NETWORK RECONNAISSANCE',
    tagline: 'Map the services before assessing the risk.', summary: 'An authorised local-network Nmap exercise with published scan results and visual documentation.',
    stack: ['Nmap', 'TCP SYN scanning', 'Network reconnaissance'], repo: repo('cybersecurity-portscan-project'), visual: 'siem',
    overview: 'A network reconnaissance and port-scan project on a local 192.168.1.0/24 network. The repository describes a TCP SYN scan using nmap -sS and publishes an HTML report of hosts, ports, services, and service versions.',
    capabilities: ['Local-network host discovery.', 'TCP SYN port enumeration.', 'Open-port and service-version reporting.', 'HTML scan results and supporting images.'],
    workflow: [{ title: 'Discover', text: 'Identify hosts on the authorised local subnet.' }, { title: 'Enumerate', text: 'Use Nmap to inspect open ports and exposed services.' }, { title: 'Present', text: 'Publish the formatted scan report for review.' }],
    boundary: 'A local-network lab. Only perform reconnaissance within a scope you own or are explicitly authorised to assess.',
    evidence: [{ label: 'Workflow & scan results', url: repo('cybersecurity-portscan-project') }, { label: 'HTML scan report', url: blob('cybersecurity-portscan-project', 'Network_portscan_report.html') }],
  },
  {
    slug: 'ufw-firewall', title: 'UFW Firewall Configuration', category: 'Labs & research', eyebrow: 'NETWORK HARDENING',
    tagline: 'Allow what is needed. Block what is not.', summary: 'A step-by-step Kali Linux firewall exercise with SSH and Telnet access-control verification.',
    stack: ['UFW', 'Kali Linux', 'Linux', 'Firewall policy'], repo: repo('ufw-firewall-configuration'), visual: 'web',
    overview: 'This repository documents enabling UFW on Kali Linux, checking its status, and testing explicit access rules. The exercise allows SSH on port 22 and denies Telnet on port 23.',
    capabilities: ['Enable and inspect UFW firewall policy.', 'Allow SSH connectivity on port 22.', 'Deny Telnet traffic on port 23.', 'Test allowed and blocked connections.', 'Visual step-by-step documentation.'],
    workflow: [{ title: 'Enable', text: 'Activate UFW and inspect the starting firewall policy.' }, { title: 'Configure', text: 'Add explicit allow and deny rules for the lab services.' }, { title: 'Verify', text: 'Test SSH access and confirm the denied Telnet port is blocked.' }],
    boundary: 'An isolated configuration exercise. Firewall changes should be planned to avoid locking out legitimate administrators.',
    evidence: [{ label: 'Firewall steps & evidence', url: repo('ufw-firewall-configuration') }],
  },
  {
    slug: 'password-security-analysis', title: 'Password Security Analysis', category: 'Labs & research', eyebrow: 'SECURITY AWARENESS',
    tagline: 'Understand why a password is weak.', summary: 'A report on password complexity, common attacks, and practical account-security habits.',
    stack: ['Password analysis', 'Security awareness', 'HTML'], repo: repo('password-security-analysis'), demo: 'https://password-strength-checker-alpha.vercel.app', visual: 'password',
    overview: 'A password-security study comparing different complexity levels and discussing brute force, dictionary attacks, phishing, and credential stuffing. It also links to the custom password checker.',
    capabilities: ['Compare sample passwords of varying complexity.', 'Explain common password attacks and weaknesses.', 'Discuss unique passwords, MFA, and password managers.', 'Publish methodology, findings, and recommendations in a PDF.'],
    workflow: [{ title: 'Compare', text: 'Evaluate sample passwords with different lengths and character sets.' }, { title: 'Explain', text: 'Relate the observed weaknesses to common attack methods.' }, { title: 'Recommend', text: 'Document safer account-security practices and a practical checker.' }],
    boundary: 'Strength scores in the original report are illustrative tool results, not guaranteed resistance to attack. Do not submit real passwords to untrusted services.',
    evidence: [{ label: 'Analysis & recommendations', url: repo('password-security-analysis') }, { label: 'Full password report', url: blob('password-security-analysis', 'Password_Strength_Report.pdf') }],
  },
  {
    slug: 'browser-extension-security', title: 'Browser Extension Security Check', category: 'Labs & research', eyebrow: 'BROWSER PRIVACY',
    tagline: 'Small extensions. Meaningful permissions.', summary: 'A browser-extension risk assessment covering permissions, data leakage, and safer browsing.',
    stack: ['Permission analysis', 'Browser security', 'Privacy assessment'], repo: repo('browser-extension-security-check'), visual: 'research',
    overview: 'A documented assessment of browser-extension security risks. The report covers permission requests, data-leakage risks, mitigation strategies, and recommendations for safer use.',
    capabilities: ['Assess extension permissions.', 'Identify privacy and data-leakage risks.', 'Discuss mitigation and safer browsing practices.', 'Publish a detailed extension-security report.'],
    workflow: [{ title: 'Review', text: 'Inspect extension permissions and their implications.' }, { title: 'Assess', text: 'Consider security threats and potential data exposure.' }, { title: 'Guide', text: 'Document mitigation strategies and recommendations.' }],
    boundary: 'A report-based assessment, not a live extension scanner or a blanket verdict on every browser extension.',
    evidence: [{ label: 'Assessment repository', url: repo('browser-extension-security-check') }, { label: 'Browser extensions report', url: blob('browser-extension-security-check', 'Browser_Extensions_Report.pdf') }],
  },
  {
    slug: 'vpn-privacy', title: 'VPN Privacy', category: 'Labs & research', eyebrow: 'SECURE COMMUNICATION',
    tagline: 'Privacy tools, understood in context.', summary: 'A Windscribe Free VPN exercise exploring IP masking, encrypted browsing, and the limits of VPNs.',
    stack: ['Windscribe VPN', 'Network privacy', 'Security documentation'], repo: repo('VPN-Privacy'), visual: 'research',
    overview: 'A practical report on setting up Windscribe Free VPN, verifying IP address masking and encrypted browsing, and understanding the benefits and limitations of VPN usage.',
    capabilities: ['VPN setup and connection verification.', 'IP address masking checks.', 'Encrypted-browsing observations.', 'A written review of benefits and limitations.'],
    workflow: [{ title: 'Connect', text: 'Set up and connect with Windscribe Free VPN.' }, { title: 'Verify', text: 'Review the changed IP address and browsing behaviour.' }, { title: 'Reflect', text: 'Document the privacy benefits alongside the tool’s limitations.' }],
    boundary: 'A learning exercise. A VPN does not guarantee anonymity or replace secure account practices.',
    evidence: [{ label: 'Project documentation', url: repo('VPN-Privacy') }, { label: 'VPN privacy report', url: blob('VPN-Privacy', 'Windscribe_VPN_Report.pdf') }],
  },
];

export const categories: Category[] = ['SOC & detection', 'Security tools', 'Labs & research', 'Web development'];
export const featuredProjects = projects.filter(p => p.featured);
export const getProject = (slug: string) => projects.find(p => p.slug === slug);
