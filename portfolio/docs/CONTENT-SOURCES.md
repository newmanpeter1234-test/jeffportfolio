# Current document and location update — 22 October 2026

This section supersedes the historical initial-research decisions below.

- The user explicitly changed the current base to **Doha, Qatar**. Historical training/work locations remain Kochi and the BCA location remains Bengaluru.
- `jeffresume-qatar.pdf` is now the current résumé, preserved byte-for-byte at both new and legacy paths. Its own Qatar/Dubai header has not been rewritten. Responsibilities for the Wahy role follow this updated résumé.
- The original experience letter names **Wahy Lab Solutions**, **Junior Cyber Security Analyst**, **1 September 2025 to 29 May 2026**.
- The original EC-Council CSA certificate is issued **27 July 2025**, overriding the earlier September date. No independent renewal/current-status or issuer-verification claim is made.
- The scanned **CICSA v3** certificate is dated **11 July 2025**. The user's “CICAC” wording is not used to rename the actual supplied qualification.
- The updated résumé lists an ongoing MCA at SMU; adding it to the website timeline is recommended in the review, not silently implemented. Security+ is absent from the new résumé and is not treated as an earned credential.
- High-resolution preview pages are generated from the original files, with a readable text version/summary for accessibility. Download is optional within the viewer only.

## Original uploaded PDF SHA256

- `/documents/jefrine-correya-resume.pdf`: `8872b51f624a402369ff9887d2651dbd6768e0bbd37027ff654596053eb6322d`
- `/documents/jefrine-cicsa-certificate.pdf`: `e545bb08920e10d5f2b7ef6a119cacc4f94a8400ca80c349b5cb6bcfdf1af2ec`
- `/documents/jefrine-ec-council-csa-certificate.pdf`: `b621e75367fd10b2ebb3e69525a68b8b3b3ece5b6797b5bf29c9798b6363d8a8`
- `/documents/jefrine-experience-certificate.pdf`: `3d6fae5e6dfc767b04c3fc9c50b7898dc2905916acb4d1c0c87d42b7d107f741`

---

## Historical initial research — 14 October 2026

The material below records the initial redesign baseline, not the current location or current document set.

# Content sources and factual decisions

Research date: **14 October 2026**. Only Jefrine's public professional material and the user's explicit confirmations were used. Public README claims were treated as project descriptions, not independent validation.

## Primary sources

1. Live portfolio: https://www.jeffsec.in
2. Current downloadable résumé: https://www.jeffsec.in/assets/jeffresume%20.pdf
3. Public profile: https://github.com/jeff-1217
4. Original working repository: https://github.com/jeff-1217/Portfolio
5. Current site's newer public source/assets: https://github.com/jeff-1217/jeffportfolio
6. Public repository inventory: https://api.github.com/users/jeff-1217/repos?per_page=100&sort=updated
7. Per-project README files, implementation files, lab reports, and repository trees. Every case study contains its specific evidence URLs in `src/data/content.ts`.

LinkedIn was linked as the user's existing professional contact channel. Automated retrieval returned HTTP 403; no LinkedIn-only career claims were inferred.

## Source discrepancies resolved with the user

### Employer / role

- Live biography: “Way Labs”, “Cybersecurity Intern”, without exact dates.
- Current downloadable résumé: **“Jr Cyber Security Analyst — Web Application Testing | Wahy Labs (On-site, Kochi, Kerala)”, September 2025–May 2026**.
- An older PDF in the original repository: Elevate Labs, October–December 2025.
- **User explicitly selected the current résumé as the source of truth** and selected the option not to carry the older Elevate entry forward without confirmation. The timeline therefore uses Wahy Labs and the résumé's dates. The older PDFs remain in repository history / original assets; no new employment is invented.

### Location

- Request and live biography: Kochi.
- Current résumé header: Bengaluru.
- **User explicitly selected Kochi, Kerala for the portfolio.** The original résumé is not rewritten. The `/sources` page explains this difference.

### Qualifications

- Current résumé: EC-Council Certified SOC Analyst v1, September 2025; RedTeam Hacker Academy CICSA, July 2025; CompTIA Security+, pursuing.
- An older PDF lists a different CSA month. The current résumé's September 2025 date is used.
- No certificate ID, credential verification URL, exam score, or official badge was available. None was fabricated. Credential symbols are custom interface graphics.

## Preserved professional information

- Name: Jefrine Correya. Existing bio variants use “Jefrin”; the user-requested name and current résumé spelling are used consistently.
- BCA: Koshys Institute of Management Studies, Bangalore North University, October 2021–August 2024, Bengaluru, Karnataka.
- CICSA training: February–July 2025, RedTeam Hacker Academy, Kochi.
- Cybersecurity experience: the existing site's **1+ years** claim is retained, not recalculated or inflated. Its separate two-month web-development claim is acknowledged on Journey.
- All 20 originally self-rated skills and their exact qualitative ratings are preserved. No numerical skill percentages are fabricated.
- Additional tools, machine-learning techniques, networking fundamentals, OS knowledge, soft skills, and languages are grounded in the current résumé / project documentation. Tamil is included because it appears in the current résumé.
- Public email, phone, LinkedIn, GitHub, original demo URLs, and actual résumé download are retained.

## Project inventory

The original nine projects are all included: SLMS, Netflix Clone, URL Phishing Detector, PassChecker, Web Vulnerability Scanner, ASTRA Monitor, Splunk SOC Lab, Wazuh SIEM Lab, and SOC Threat Detection Assistant.

Further source-grounded case studies cover ML Threat Monitor (résumé-documented), IOC Automation Pipeline, Wireshark Network Traffic Analysis, Phishing Email Analysis, Nessus Vulnerability Scan, Cybersecurity Portscan Project, UFW Firewall Configuration, Password Security Analysis, Browser Extension Security Check, and VPN Privacy. Total: **19**.

All **26** public repositories are separately indexed, preserving older versions and additional interface / portfolio experiments without inventing descriptions where no public description exists.

## Important project boundaries

- **ASTRA Monitor:** README describes simulated network traffic and simulated response playbooks. The code also contains a separate Isolation Forest / Random Forest training pipeline. No production detection accuracy, real enforcement, or enterprise deployment is claimed.
- **SOC assistant:** README and résumé describe CrewAI agents. Current `soc_agent.py` also implements a sequential direct Python / Groq workflow. These are explicitly distinguished. No invented fixed agent count is asserted.
- **Splunk SOC Lab:** Windows Splunk Enterprise, Ubuntu Universal Forwarder, `/var/log/auth.log`, `/var/log/syslog`, TCP 9997, and controlled SSH brute-force detection are documented. The repository calls its dashboard pictures mockups; their displayed counts are not used as portfolio performance metrics. The actual report path in the repository tree is `reports/Jefrin_Final_SOC_Report.pdf` (rather than a broken example filename in the README).
- **Wazuh SIEM Lab:** documented rules 5710 / level 5, 5716 / level 5, and 5720 / level 10 are retained. Lab telemetry is not described as production monitoring.
- **URL Phishing Detector:** both lexical analysis and Google Safe Browsing are present. A clean verdict is not represented as a guarantee of safety. The original and version-two repositories are retained.
- **Web Vulnerability Scanner:** Nmap scan profiles and parsing are verified against public `scanner.py`. The portfolio performs no scanning and explicitly requires authorised targets for the external tool.
- **SLMS:** current public source is React / TypeScript and has an in-memory `mockApi.ts`. It is described as a prototype, not production authentication or real student records.
- **ML Threat Monitor:** described from the résumé. No separate repository, benchmark, or live deployment is invented.
- **IOC automation:** the approximately 80% effort-reduction figure is retained only as an author-reported README estimate, with an explicit non-benchmark caveat.
- **External demos:** original destinations are preserved and labelled “Original demo”; uptime is not promised. No placeholders are substituted for unavailable hosted projects.

## Visual honesty / privacy

The globe is a geometric topology illustration. The animated project covers are conceptual SVG/CSS artwork based on documented features. The console uses reserved documentation IPs (`198.51.100.24`, `192.0.2.10`) and an `.invalid` domain, with clear local-simulation labels. No threat-intelligence API, backend scanner, analytics service, or external font service is called at runtime.

The contact composer makes an email draft in the visitor's email application. It does not claim to send messages. Real passwords are never requested or evaluated by this portfolio.

## Original résumé integrity

SHA-256: `9034fcc296b821f35b48499bd226143ea865bb9c2046108d699879de1481b36a`

The new download and preserved legacy résumé URL serve the same unmodified original PDF.
