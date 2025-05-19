"""merge heads

Revision ID: 3e19e1e39d57
Revises: 9cf388c1d691, rename_profile_to_user
Create Date: 2025-05-18 20:34:47.609809

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3e19e1e39d57'
down_revision: Union[str, None] = ('9cf388c1d691', 'rename_profile_to_user')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
