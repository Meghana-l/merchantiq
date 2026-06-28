# MerchantIQ

**Live:** https://merchantiq-oyx3yll8z-meghanalnswamydr-5532s-projects.vercel.app/

A Merchant Services data governance and reporting intelligence platform built for the Global Payments Solutions Data Strategy & Governance workflow. MerchantIQ mirrors the day-to-day operations of a Merchant BA team — metric reconciliation across source systems, EDM-compliant issue tracking, SQL query management, data lineage tracing, and live macroeconomic context for merchant volume analysis.

---

## Tabs

### MIRA Overview
The primary reporting view, modeled after the Merchant Commerce Insight Reporting & Analytics (MIRA) layer. Select any enterprise merchant to see 12-month gross volume trends, transaction count, average decline rate, and chargeback rate — all sourced from the simulated MCM ADS (Merchant Commerce Authorized Data Source). Includes an AI Insight button that generates real-time executive variance commentary using a live LLM, and a segment performance breakdown across Grocery, Retail, QSR, Travel, Hospitality, and Pharmacy.

<img width="1566" height="855" alt="1" src="https://github.com/user-attachments/assets/6ef9ce49-d5e8-4c20-83b9-0c5efa071e28" />


### Metric Alignment
Cross-source reconciliation matrix comparing 8 critical reporting metrics across MIRA, MCM ADS, and Legacy EDW. Flags misalignments, quantifies the delta, identifies the preferred source of truth, and includes root-cause notes explaining whether differences are definitional gaps or data errors — the core analytical task in any Merchant BA governance role.

<img width="1885" height="636" alt="image" src="https://github.com/user-attachments/assets/e3b3fd1c-63bc-4df8-bf52-b9db36b651d4" />


### Data Quality
EDM-compliant issue management queue. Each issue is classified by severity (Critical, High, Medium, Low), tracked through a status workflow (Open → In Progress → Resolved), and annotated with the affected field, source system, responsible owner, SLA, and lineage impact. Filterable by status and severity. Includes an EDM policy compliance panel covering Data Quality Controls, Metadata Integrity, Lineage Documentation, and Issue Management SLA.

<img width="1746" height="645" alt="image" src="https://github.com/user-attachments/assets/a20b6c05-26a9-4ce6-953d-333de6546a1d" />


### Query Tracker
Ad-hoc SQL request management across the team. Each query entry shows the requestor, priority, ETA, and current status. Clicking a query opens the full SQL, lineage annotation, and source system context — reflecting the analyst workflow of triaging, writing, and delivering reporting requests against MCM ADS and MIRA.

<img width="1885" height="846" alt="image" src="https://github.com/user-attachments/assets/5ffa4792-9d05-4f32-8b44-3fda4928bc65" />


### Data Lineage
Interactive SVG pipeline diagram tracing merchant data from source systems (Visa/MC network feed, Merchant Onboarding DB, Settlement Processor) through ingestion, processing, and DQ controls, into MIRA reporting, regulatory outputs, and the analytics layer. Hover any node to highlight its upstream and downstream dependencies. Includes a pipeline layer summary table with owners, SLAs, and migration status, plus a metadata integrity checklist.

<img width="1865" height="881" alt="image" src="https://github.com/user-attachments/assets/e2a18e6a-8479-45b8-890d-2f76650681cb" />


### Macro Context
Live Federal Reserve FRED API integration pulling retail sales (RSXFS) and Personal Consumption Expenditures (PCE) to contextualize merchant payment volume trends. Includes a segment-level correlation analysis (e.g. Retail Sales Growth → Grocery/Retail segment: 0.91 correlation) and a Q4 2024 merchant volume forecast by segment with macro driver annotations.

<img width="1889" height="852" alt="image" src="https://github.com/user-attachments/assets/e866ec3b-90d7-4c6a-975c-94513ae828e8" />


---

## Data Sources

- **Federal Reserve FRED API** — live retail sales and consumer spending data
- **Groq LLM API** — AI-generated variance commentary on merchant transaction trends
- **Simulated MCM ADS** — deterministic merchant transaction data reflecting realistic enterprise payment volumes, decline rates, and chargeback metrics
