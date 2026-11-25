"""Add M18 continuity_tokens, M17 ground_truth_callbacks, and PostgreSQL RLS policies.

Revision ID: 0002_continuity_m17_m18_and_rls
Revises: 0001_initial_schema
Create Date: 2026-11-25 22:42:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = "0002_continuity_m17_m18_and_rls"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "continuity_tokens",
        sa.Column("token", sa.String(64), primary_key=True),
        sa.Column("domain", sa.String(16), nullable=False, server_default="WOMEN"),
        sa.Column("consent_status", sa.String(128), nullable=False),
        sa.Column("repeat_statements", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("paper_baseline", sa.Integer(), nullable=False, server_default="4"),
        sa.Column("current_stage_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("steps", sa.JSON(), nullable=False),
        sa.Column("updated_at", sa.String(64), nullable=False),
    )
    op.create_table(
        "ground_truth_callbacks",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("case_token", sa.String(64), nullable=False),
        sa.Column("channel", sa.String(32), nullable=False),
        sa.Column("code", sa.String(32), nullable=False),
        sa.Column("discrepancy_flag", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column("reported_at", sa.String(64), nullable=False),
    )

    if op.get_bind().dialect.name == "postgresql":
        for tbl in ("gap_contracts", "matters", "continuity_tokens"):
            op.execute(f"ALTER TABLE {tbl} ENABLE ROW LEVEL SECURITY;")
            op.execute(
                f"CREATE POLICY {tbl}_domain_isolation ON {tbl} "
                "USING (current_setting('app.active_domain', true) IS NULL "
                "OR domain = current_setting('app.active_domain', true));"
            )


def downgrade() -> None:
    if op.get_bind().dialect.name == "postgresql":
        for tbl in ("gap_contracts", "matters", "continuity_tokens"):
            op.execute(f"DROP POLICY IF EXISTS {tbl}_domain_isolation ON {tbl};")
            op.execute(f"ALTER TABLE {tbl} DISABLE ROW LEVEL SECURITY;")
    op.drop_table("ground_truth_callbacks")
    op.drop_table("continuity_tokens")
