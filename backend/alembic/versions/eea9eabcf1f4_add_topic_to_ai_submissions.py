"""Add topic to AI submissions

Revision ID: eea9eabcf1f4
Revises: b83254832dbc
Create Date: 2025-05-28 21:13:20.453176

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'eea9eabcf1f4'
down_revision: Union[str, None] = 'b83254832dbc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('quiz_submissions', sa.Column('topic', sa.String(), nullable=True))
    op.alter_column('users', 'achievements',
               existing_type=postgresql.JSON(astext_type=sa.Text()),
               nullable=True,
               existing_server_default=sa.text("'[]'::json"))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'achievements',
               existing_type=postgresql.JSON(astext_type=sa.Text()),
               nullable=False,
               existing_server_default=sa.text("'[]'::json"))
    op.drop_column('quiz_submissions', 'topic')
    # ### end Alembic commands ###
