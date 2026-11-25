"""Initial WCD Protection Intelligence schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-11-25
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "evidence_library",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("title", sa.String(256), nullable=False),
        sa.Column("source_org", sa.String(128), nullable=False),
        sa.Column("publication_date", sa.String(32), nullable=False),
        sa.Column("document_type", sa.String(64), nullable=False),
        sa.Column("source_url_or_ref", sa.Text(), nullable=False),
        sa.Column("credibility_category", sa.String(64), nullable=False),
        sa.Column("source_origin", sa.String(32), nullable=False),
        sa.Column("applicable_domain", sa.String(16), nullable=False),
        sa.Column("epistemic_class", sa.String(32), nullable=False),
        sa.Column("extracted_claim", sa.Text(), nullable=False),
        sa.Column("confidence_score", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True)),
    )
    op.create_table(
        "gap_contracts",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("gap_type", sa.String(32), nullable=False),
        sa.Column("title", sa.String(256), nullable=False),
        sa.Column("domain", sa.String(16), nullable=False),
        sa.Column("location", sa.JSON(), nullable=False),
        sa.Column("affected_cohort", sa.String(256), nullable=False),
        sa.Column("root_cause_hypothesis", sa.Text(), nullable=False),
        sa.Column("statutory_basis", sa.String(256), nullable=False),
        sa.Column("named_owner_role", sa.String(128), nullable=False),
        sa.Column("mandated_intervention", sa.Text(), nullable=False),
        sa.Column("kpi_metric", sa.String(128), nullable=False),
        sa.Column("kpi_baseline", sa.Float(), nullable=False),
        sa.Column("kpi_target", sa.Float(), nullable=False),
        sa.Column("kpi_source", sa.String(128), nullable=False),
        sa.Column("kpi_frequency", sa.String(32), nullable=False),
        sa.Column("estimated_cost_inr", sa.Float(), nullable=False),
        sa.Column("deadline_date", sa.String(32), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("severity", sa.String(16), nullable=False),
        sa.Column("confidence", sa.String(16), nullable=False),
        sa.Column("evidence_ids", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.String(64), nullable=False),
        sa.Column("updated_at", sa.String(64), nullable=False),
    )
    op.create_table(
        "gap_investigations",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("gap_id", sa.String(64), nullable=False),
        sa.Column("domain", sa.String(16), nullable=False),
        sa.Column("problem_summary", sa.Text(), nullable=False),
        sa.Column("verified_facts", sa.JSON(), nullable=False),
        sa.Column("conflicting_evidence", sa.JSON(), nullable=False),
        sa.Column("data_gaps", sa.JSON(), nullable=False),
        sa.Column("hypotheses", sa.JSON(), nullable=False),
        sa.Column("possible_interventions", sa.JSON(), nullable=False),
        sa.Column("legal_references", sa.JSON(), nullable=False),
        sa.Column("scheme_references", sa.JSON(), nullable=False),
        sa.Column("dependencies", sa.JSON(), nullable=False),
        sa.Column("assigned_investigator_role", sa.String(128), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("updated_at", sa.String(64), nullable=False),
    )
    op.create_table(
        "interventions",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("gap_id", sa.String(64), nullable=False),
        sa.Column("type", sa.String(64), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("owner_role", sa.String(128), nullable=False),
        sa.Column("target_date", sa.String(32), nullable=False),
        sa.Column("kpi_metric", sa.String(128), nullable=False),
        sa.Column("kpi_baseline", sa.Float(), nullable=False),
        sa.Column("kpi_target", sa.Float(), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("approval_role", sa.String(128), nullable=True),
        sa.Column("approved_at", sa.String(64), nullable=True),
    )
    op.create_table(
        "outcomes",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("intervention_id", sa.String(64), nullable=False),
        sa.Column("gap_id", sa.String(64), nullable=False),
        sa.Column("baseline", sa.Float(), nullable=False),
        sa.Column("target", sa.Float(), nullable=False),
        sa.Column("observed_result", sa.Float(), nullable=False),
        sa.Column("unit", sa.String(32), nullable=False),
        sa.Column("measurement_date", sa.String(32), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("evidence_notes", sa.Text(), nullable=False),
    )
    op.create_table(
        "audit_chain",
        sa.Column("block_index", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("id", sa.String(64), nullable=False, unique=True),
        sa.Column("timestamp", sa.String(64), nullable=False),
        sa.Column("actor_role", sa.String(64), nullable=False),
        sa.Column("action", sa.String(64), nullable=False),
        sa.Column("entity_type", sa.String(64), nullable=False),
        sa.Column("entity_id", sa.String(64), nullable=False),
        sa.Column("details", sa.Text(), nullable=False),
        sa.Column("previous_hash", sa.String(64), nullable=False),
        sa.Column("sha256_hash", sa.String(64), nullable=False),
    )


def downgrade() -> None:
    for table in ["audit_chain", "outcomes", "interventions", "gap_investigations", "gap_contracts", "evidence_library"]:
        op.drop_table(table)
