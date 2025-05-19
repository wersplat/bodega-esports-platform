"""Rename Profile to User and update foreign keys

Revision ID: rename_profile_to_user
Revises: 680a8f027c13
Create Date: 2025-05-18 20:35:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'rename_profile_to_user'
down_revision = '680a8f027c13'
branch_labels = None
depends_on = None

def upgrade():
    # Rename profile_id columns to user_id in all relevant tables
    op.alter_column('team_invitations', 'profile_id', new_column_name='user_id', 
                   existing_type=sa.UUID(), existing_nullable=True)
    
    op.alter_column('team_members', 'profile_id', new_column_name='user_id', 
                   existing_type=sa.UUID(), existing_nullable=False)
    
    op.alter_column('player_stats', 'player_id', new_column_name='user_id', 
                   existing_type=sa.UUID(), existing_nullable=False)
    
    op.alter_column('webhooks', 'profile_id', new_column_name='user_id', 
                   existing_type=sa.UUID(), existing_nullable=True)
    
    op.alter_column('notifications', 'profile_id', new_column_name='user_id', 
                   existing_type=sa.UUID(), existing_nullable=True)
    
    # Rename the table from profiles to users if it exists
    op.rename_table('profiles', 'users')
    
    # Update the sequence name if it exists
    op.execute("""
    DO $$
    BEGIN
        IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'profiles_id_seq') THEN
            ALTER SEQUENCE profiles_id_seq RENAME TO users_id_seq;
        END IF;
    END $$;
    """)

def downgrade():
    # Revert the sequence name
    op.execute("""
    DO $$
    BEGIN
        IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'users_id_seq') THEN
            ALTER SEQUENCE users_id_seq RENAME TO profiles_id_seq;
        END IF;
    END $$;
    """)
    
    # Revert the table name
    op.rename_table('users', 'profiles')
    
    # Revert column renames
    op.alter_column('team_invitations', 'user_id', new_column_name='profile_id', 
                   existing_type=sa.UUID(), existing_nullable=True)
    
    op.alter_column('team_members', 'user_id', new_column_name='profile_id', 
                   existing_type=sa.UUID(), existing_nullable=False)
    
    op.alter_column('player_stats', 'user_id', new_column_name='player_id', 
                   existing_type=sa.UUID(), existing_nullable=False)
    
    op.alter_column('webhooks', 'user_id', new_column_name='profile_id', 
                   existing_type=sa.UUID(), existing_nullable=True)
    
    op.alter_column('notifications', 'user_id', new_column_name='profile_id', 
                   existing_type=sa.UUID(), existing_nullable=True)
