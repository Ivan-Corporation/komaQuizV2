"""Add wallet address

Revision ID: 775c326cd879
Revises: 0c092b0ec332
Create Date: 2025-06-08 17:22:30.346791

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '775c326cd879'
down_revision: Union[str, None] = '0c092b0ec332'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('wallet_address', sa.String(), nullable=True))
    op.create_unique_constraint(None, 'users', ['wallet_address'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_column('users', 'wallet_address')
    # ### end Alembic commands ###
