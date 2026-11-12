# Data Governance & Privacy Architecture
## Compliance Specification for DPDP Act 2023, JJ Act (s.74), POCSO (s.23), & PWDVA (s.12)

---

### 1. Zero-PII Ingestion Standard

To eliminate breach hazards and survivor stigmatization, no raw personal identifier enters the centralized operational layer or AI context window.

```
+-----------------------------------------------------------------------------------------------+
|                                ZERO-PII INGESTION PIPELINE                                    |
+-----------------------------------------------------------------------------------------------+
| Raw Beneficiary Contact (OSC / Helpline 181 / Police Station)                                 |
|   |                                                                                           |
|   v [Client-Side Salted Cryptographic HMAC-SHA256 Tokenizer]                                  |
|                                                                                               |
| Case Token: CASE-DV-2026-PAT-0842                                                             |
| Department: HEALTH                                                                            |
| State Machine Node: MEDICAL_EXAM_PENDING                                                      |
| Statutory Clock: T0 + 24h Remaining: 5.5h                                                     |
|                                                                                               |
| STRICTLY EXCLUDED: Name, Aadhaar, Phone, Physical Address, Biometrics, Medical Diagnosis Raw |
+-----------------------------------------------------------------------------------------------+
```

---

### 2. Statutory Confidentiality Compliance Matrix

| Legal Statute | Section | Mandate | System Implementation |
|:---|:---|:---|:---|
| **Digital Personal Data Protection Act 2023** | Sec. 4 & 6 | Purpose limitation & verifiable consent for processing. | Consent token logged with timestamp; purpose-bound access per institutional role. |
| **Juvenile Justice Act 2015** | Sec. 74 | Strict prohibition of disclosing child identity in media or public systems. | Child domain architecturally isolated; synthetic demo tokens only in Phase 1. |
| **POCSO Act 2012** | Sec. 23 | Non-disclosure of victim identity in any report or legal filing. | System masks all case tokens; access restricted to designated Special Court / CWC. |
| **PWDVA 2005** | Sec. 12(4) & Sec. 21 | Safe communication without endangering survivor in domestic residence. | No unsolicited SMS/WhatsApp sent to survivor; status accessed via pull authentication. |

---

### 3. Row-Level Security (RLS) & Access Scope

```sql
-- PostgreSQL Institutional Multi-Tenant Isolation
ALTER TABLE case_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY osc_access_policy ON case_tokens
    FOR SELECT USING (
        current_department = 'WCD_OSC' 
        AND district_id = current_setting('app.current_user_district')
    );

CREATE POLICY dm_supervisor_policy ON case_tokens
    FOR ALL USING (
        current_setting('app.current_user_role') = 'DISTRICT_COLLECTOR'
        AND district_id = current_setting('app.current_user_district')
    );
```

---

### 4. Data Retention & Right to Erasure
1. **Operational Case Tokens:** Retained for statutory limitation period (3 years post-closure for PWDVA, 7 years post-majority for POCSO).
2. **Audit Ledger:** Cryptographic hash chains retained permanently under WORM (Write Once, Read Many) policies for CAG and parliamentary audits.
3. **Right to Erasure:** Handled via salt rotation — deleting the localized salt destroys the ability to link any historical token back to physical registers.

