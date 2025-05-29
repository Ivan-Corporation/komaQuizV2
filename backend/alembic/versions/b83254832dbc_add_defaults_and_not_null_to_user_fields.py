"""Add defaults and not-null to user fields

Revision ID: b83254832dbc
Revises: 76f8df4153a3
Create Date: 2025-05-28 18:46:20.921499
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b83254832dbc'
down_revision: Union[str, None] = '76f8df4153a3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # First, backfill any NULL values
    op.execute("UPDATE users SET experience_points = 0 WHERE experience_points IS NULL")
    op.execute("UPDATE users SET level = 1 WHERE level IS NULL")
    op.execute("UPDATE users SET achievements = '[]' WHERE achievements IS NULL")

    # Then, apply NOT NULL constraints
    op.alter_column('users', 'experience_points',
                    existing_type=sa.INTEGER(),
                    nullable=False,
                    server_default='0')

    op.alter_column('users', 'level',
                    existing_type=sa.INTEGER(),
                    nullable=False,
                    server_default='1')

    op.alter_column('users', 'achievements',
                    existing_type=postgresql.JSON(astext_type=sa.Text()),
                    nullable=False,
                    server_default=sa.text("'[]'::json"))


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('users', 'level',
                    existing_type=sa.INTEGER(),
                    nullable=True,
                    server_default=None)

    op.alter_column('users', 'achievements',
                    existing_type=postgresql.JSON(astext_type=sa.Text()),
                    nullable=True,
                    server_default=None)

    op.alter_column('users', 'experience_points',
                    existing_type=sa.INTEGER(),
                    nullable=True,
                    server_default=None)
