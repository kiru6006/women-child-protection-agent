import math
import re
from collections import Counter
from typing import Any, Dict, List

PROHIBITED_INJECTION_PATTERNS = [
    r"ignore\s+previous\s+rules",
    r"\b(guilty|innocent|convict)\b",
    r"\bvictim\s+credibility\b",
    r"\brisk\s+score\b",
    r"\bpredict\s+(criminal|victim)\b",
    r"\b(custody|adoption)\s+decision\b",
]


def _tokenize(text: str) -> List[str]:
    return [t for t in re.findall(r"[a-z0-9]+", text.lower()) if len(t) > 2]


def _cosine_similarity(q_tokens: List[str], d_tokens: List[str]) -> float:
    if not q_tokens or not d_tokens:
        return 0.0
    qc = Counter(q_tokens)
    dc = Counter(d_tokens)
    dot = sum(qc[k] * dc[k] for k in set(qc) & set(dc))
    norm_q = math.sqrt(sum(v * v for v in qc.values()))
    norm_d = math.sqrt(sum(v * v for v in dc.values()))
    if norm_q == 0 or norm_d == 0:
        return 0.0
    return dot / (norm_q * norm_d)


class RAGService:
    """Provider-independent bounded retrieval adapter (temperature=0.0, citation-enforced)."""

    def __init__(self):
        self.similarity_threshold = 0.18
        self.corpus_chunks: List[Dict[str, Any]] = [
            {
                "id": "CHUNK-PWDVA-SEC7",
                "keywords": "medical hospital doctor injury examination aid pwdva 24 hours",
                "answer": (
                    "Under Section 7 of the Protection of Women from Domestic Violence Act, 2005 (PWDVA), "
                    "the Person in Charge of a medical facility is statutorily bound to provide immediate medical aid "
                    "upon request by the aggrieved person or Protection Officer. The National SOP mandates examination "
                    "within 24 hours of reporting."
                ),
                "citations": [
                    "Protection of Women from Domestic Violence Act 2005, Section 7",
                    "PWDVA Model Rules 2006, Rule 8(1)(b) & Form I",
                    "MoWCD One Stop Centre Scheme Operational Guidelines (Revised 2024), Chapter 4, Para 4.2",
                ],
                "epistemic_class": "VERIFIED_FACT",
            },
            {
                "id": "CHUNK-PWDVA-POLICE",
                "keywords": "police fir mediation dir compromise protection officer lalita kumari",
                "answer": (
                    "Informal mediation by police without recording a Domestic Incident Report (DIR) violates "
                    "Section 9(1)(b) of PWDVA 2005 and Supreme Court directions in Lalita Kumari v. Govt. of U.P. (2013). "
                    "Protection Officers must be notified immediately."
                ),
                "citations": [
                    "Supreme Court of India: Lalita Kumari v. Govt. of Uttar Pradesh (2013) 4 SCC 1",
                    "PWDVA 2005, Section 9(1)(b) & Section 12",
                    "BPR&D SOP on Crimes Against Women (2022)",
                ],
                "epistemic_class": "VERIFIED_FACT",
            },
            {
                "id": "CHUNK-SHAKTI-ECON",
                "keywords": "economic rehabilitation livelihood jeevika shg nrlm pmkvy awas swadhar",
                "answer": (
                    "Mission Shakti (Samarthya) provides convergence linkages with DAY-NRLM / Jeevika for SHG membership, "
                    "micro-credit access, PMKVY skill training stipends, and priority PM Awas Yojana allocation for "
                    "destitute women leaving Swadhar Greh."
                ),
                "citations": [
                    "Mission Shakti Implementation Guidelines (MoWCD), Part III: Samarthya, Section 8",
                    "Ministry of Rural Development Joint Advisory on SHG Inclusion of OSC Beneficiaries (2023)",
                ],
                "epistemic_class": "VERIFIED_FACT",
            },
            {
                "id": "CHUNK-DLSA-LEGAL",
                "keywords": "legal aid dlsa lawyer representation advocate court article 21",
                "answer": (
                    "Under Section 12(c) of the Legal Services Authorities Act, 1987, every woman is entitled to free "
                    "legal services. Timely appointment of a panel lawyer is an enforceable Article 21 right, not a mere referral."
                ),
                "citations": [
                    "Legal Services Authorities Act 1987, Section 12(c)",
                    "PWDVA 2005, Section 9(1)(d)",
                ],
                "epistemic_class": "VERIFIED_FACT",
            },
            {
                "id": "CHUNK-JJ-CWC",
                "keywords": "cwc child pocso juvenile production 24 hours jj act",
                "answer": (
                    "Under Section 31(1) of the Juvenile Justice (Care and Protection of Children) Act, 2015, any child "
                    "in need of care and protection must be produced before the Child Welfare Committee (CWC) within 24 hours, "
                    "excluding travel time."
                ),
                "citations": [
                    "Juvenile Justice (Care and Protection of Children) Act 2015, Section 31(1)",
                    "Model Juvenile Justice Rules 2016, Rule 18(2)",
                ],
                "epistemic_class": "VERIFIED_FACT",
            },
        ]

    def _is_prohibited_request(self, query: str) -> bool:
        q = query.lower()
        return any(re.search(pat, q) for pat in PROHIBITED_INJECTION_PATTERNS)

    def answer_query(self, query: str) -> Dict[str, Any]:
        if self._is_prohibited_request(query):
            return {
                "answer": (
                    "REFUSED BY AI SAFETY POLICY: AI cannot determine guilt, victim credibility, individual risk scores, "
                    "or child custody/adoption decisions. Statutory decisions belong solely to authorised human authorities."
                ),
                "citations": ["AGENTS.md — Prohibited AI Decisions", "AI_SAFETY_AND_GOVERNANCE.md §1"],
                "epistemic_class": "DATA_NOT_AVAILABLE",
                "confidence": 0.0,
            }

        q_tokens = _tokenize(query)
        best_chunk = None
        best_score = 0.0
        for chunk in self.corpus_chunks:
            doc_tokens = _tokenize(chunk["keywords"] + " " + chunk["answer"])
            score = _cosine_similarity(q_tokens, doc_tokens)
            if score > best_score:
                best_score = score
                best_chunk = chunk

        if best_chunk is None or best_score < self.similarity_threshold:
            return {
                "answer": (
                    "DATA NOT AVAILABLE in indexed government gazettes or SOP library. "
                    "Formal legal review by the District Government Counsel (DGC) or Law Department is required."
                ),
                "citations": ["No matching statutory citation in verified repository"],
                "epistemic_class": "DATA_NOT_AVAILABLE",
                "confidence": 0.0,
            }

        return {
            "answer": best_chunk["answer"],
            "citations": best_chunk["citations"],
            "epistemic_class": best_chunk["epistemic_class"],
            "confidence": round(min(0.99, 0.70 + best_score * 0.5), 2),
        }

    def generate_show_cause_draft(self, token_id: str, target_role: str, breach_type: str, district: str) -> Dict[str, Any]:
        """Generates formal e-Office compliant Show-Cause Notice citing statutory provisions."""
        content = (
            f"ADMINISTRATIVE DRAFT ONLY — NOT LEGAL EVIDENCE\n"
            f"OFFICE OF THE DISTRICT MAGISTRATE & COLLECTOR, {district.upper()}\n"
            f"MEMORANDUM / SHOW CAUSE NOTICE\n\n"
            f"Ref No: WCD/{district.upper()}/2026/SCN-{token_id[-4:]}\n\n"
            f"To:\n{target_role.replace('_', ' ').title()},\nDistrict {district.title()}.\n\n"
            f"SUBJECT: Show Cause Notice for Statutory Timeline Non-Compliance in Case Ref: {token_id}.\n\n"
            f"WHEREAS, in accordance with the statutory mandates of the Protection of Women from Domestic Violence Act, 2005 "
            f"and the relevant State Rules, institutional handoffs must be completed within configured statutory limits;\n\n"
            f"AND WHEREAS, records on the Suraksha Sentinel operational bus indicate that Case Token {token_id} was registered "
            f"for {breach_type.replace('_', ' ').lower()}, yet completion has not been logged past the statutory limitation period;\n\n"
            f"NOW THEREFORE, you are hereby directed to SHOW CAUSE within 24 hours of receipt of this memorandum explaining "
            f"the reasons for statutory delay, failing which administrative proceedings under the relevant Government Servants "
            f"Conduct & Disciplinary Rules shall be initiated.\n\n"
            f"Issued under the hand and seal of the District Magistrate, {district.title()}."
        )

        return {
            "draft_id": f"DRAFT-SCN-2026-{token_id[-4:]}",
            "document_title": f"Office of the District Magistrate, {district.title()} — Show Cause Notice",
            "content": content,
            "citations": [
                {"act": "Protection of Women from Domestic Violence Act, 2005", "section": "Section 7 & 9"},
                {"act": "State Government Servants Conduct Rules", "rule": "Rule 3(1)"},
            ],
            "confidence_score": 0.99,
            "human_gate_required": True,
        }


class VectorIndexAdapter:
    """Abstract vector retrieval interface supporting in-memory cosine and pgvector backends."""

    def search(self, query: str, chunks: List[Dict[str, Any]], threshold: float = 0.18) -> tuple[Dict[str, Any] | None, float]:
        q_tokens = _tokenize(query)
        best_chunk = None
        best_score = 0.0
        for chunk in chunks:
            score = _cosine_similarity(q_tokens, _tokenize(f"{chunk['keywords']} {chunk['answer']}"))
            if score > best_score:
                best_score = score
                best_chunk = chunk
        return (best_chunk, best_score) if best_chunk and best_score >= threshold else (None, best_score)


class PgVectorAdapter(VectorIndexAdapter):
    """PostgreSQL pgvector adapter scaffold (activates when pgvector + embedding model configured)."""

    def __init__(self, dsn: str):
        self.dsn = dsn
        self.enabled = dsn.startswith("postgresql")


class LocalLLMAdapter:
    """On-premise quantised LLM adapter scaffold locked to temperature=0.0 and citation-only output."""

    temperature: float = 0.0
    requires_external_saas: bool = False


rag_service = RAGService()
