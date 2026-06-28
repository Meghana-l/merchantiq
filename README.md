# MerchantIQ

A data strategy and governance intelligence platform for Merchant Services reporting, built to mirror the workflows of a Global Payments Solutions Data Strategy & Governance team.

## Features

**MIRA Overview** — Interactive merchant transaction analytics with AI-powered variance commentary. Drill into any enterprise merchant's 12-month gross volume, decline rate, and chargeback trends. Uses Groq LLM to generate executive-level data insights on demand.

**Metric Alignment** — Cross-source reconciliation matrix comparing MIRA, MCM ADS (Merchant Commerce Authorized Data Source), and Legacy EDW values across 8 critical reporting metrics. Surfaces definitional gaps and root-cause notes for each misalignment.

**Data Quality Issue Management** — EDM-compliant issue tracker with severity classification (Critical → Low), status workflow (Open → In Progress → Resolved), SLA tracking, and per-issue lineage impact. Filterable by status and severity.

**Ad-Hoc Query Tracker** — SQL query queue management for analyst requests, with inline SQL viewer, priority triage, ETA tracking, and lineage annotation per query.

**Data Lineage** — Interactive SVG pipeline diagram tracing data from Visa/MC network feeds through MCM ADS ingestion, DQ controls, and into MIRA reporting and regulatory outputs. Hover-to-highlight dependency tracing.

**Macro Context** — Live FRED API integration pulling retail sales, PCE, and consumer spending data to contextualize merchant volume trends. Includes segment-level correlation analysis and Q4 volume forecasts.

## Data Sources

- Federal Reserve FRED API (retail sales, consumer spending)
- Groq LLM API (AI variance commentary)
- Simulated MCM ADS merchant transaction data
