# Data Governance, Privacy & Security Architecture
## Compliance Specification for DPDP Act 2023, JJ Act (s.74), POCSO (s.23), & PWDVA (s.12)

---

## 1. Zero-PII Ingestion Standard

No raw personal identifier enters the central operational layer, vector store, or LLM context window:

```
Raw Beneficiary Contact (OSC / Helpline 181 / Police Station)
  │
  ▼ [Client-Side Salted Cryptographic HMAC-SHA256 Tokenizer]
Case Token: CASE-DV-2026-PAT-0842 | Dept: HEALTH | State: MEDICAL_EXAM_PENDING | Clock: T0+24h
STRICTLY EXCLUDED: Name, Aadhaar, Phone, Physical Address, Biometrics, Raw Medical History, Caste/Religion/Sexual Orientation (v1)
```

* **Pointers-Only Storage:** Central DB stores status, deadlines, and document pointer references only. Underlying police FIRs and medical records remain with the owning statutory institution.
* **Domain & Family Separation:** `WomanCase` and `ChildCase` remain separate tokens. Any household linkage uses a restricted `FamilyContext` junction requiring explicit statutory authority — never unrestricted family profiles.

---

## 2. Statutory Confidentiality Compliance Matrix

| Statute | Section | Mandate | System Control |
|---|---|---|---|
| **DPDP Act 2023** | Sec. 4 & 6 | Purpose limitation, verifiable consent, data minimisation | Consent token (`scope`, `given_at`, `withdrawn_at`, `witness`) + mandatory-law boundary display |
| **Juvenile Justice Act 2015** | Sec. 74 | Absolute bar on disclosing child identity | Domain B isolated; no live child records in Phase 1 MVP |
| **POCSO Act 2012** | Sec. 23 | Non-disclosure of victim identity in reports/filings | Masked case tokens; access scoped to designated Special Court / CWC |
| **PWDVA 2005** | Sec. 12(4), 21 | Safe communication without alerting abuser | Address-masking option; no unsolicited SMS/WhatsApp; status codes only via pull auth |

---

## 3. PostgreSQL Row-Level Security (RLS) & Access Controls

```sql
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

* **Secrets & Transport:** AES-256 at rest, TLS 1.3 in transit; no hardcoded salts or wildcard CORS in production; secrets injected via environment/vault.
* **Aggregate Privacy:** Enforce minimum cell size ($k \ge 50$) and suppress village-level counts in v1.

---

## 4. Data Retention & Right to Erasure

1. **Operational Case Tokens:** Retained per statutory limitation period (3 years post-closure for PWDVA; 7 years post-majority for POCSO).
2. **Audit Ledger:** Append-only SHA-256 hash chain retained under WORM semantics; every read and write of sensitive records logged with actor role and reason.
3. **Right to Erasure:** Executed via localized salt deletion/rotation, severing historical tokens from physical institutional registers.
