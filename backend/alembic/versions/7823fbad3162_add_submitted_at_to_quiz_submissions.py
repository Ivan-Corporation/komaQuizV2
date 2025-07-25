"""Add submitted_at to quiz_submissions

Revision ID: 7823fbad3162
Revises: 95e4f69f0b6a
Create Date: 2025-05-26 17:16:47.857952

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7823fbad3162'
down_revision: Union[str, None] = '95e4f69f0b6a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('quiz_submissions', sa.Column('submitted_at', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('quiz_submissions', 'submitted_at')
    # ### end Alembic commands ###
