from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Index
from sqlalchemy.orm import relationship
from ..database import Base
import datetime
import hashlib

# ─────────── League, Season, Conference, Division ───────────

class League(Base):
    __tablename__ = "leagues"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    season_id = Column(Integer, ForeignKey("seasons.id"))

    season = relationship("Season", back_populates="leagues")
    settings = relationship("LeagueSettings", uselist=False, back_populates="league")
    conferences = relationship("Conference", back_populates="league")
    teams = relationship("Team", back_populates="league")


class Season(Base):
    __tablename__ = "seasons"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    league_id = Column(Integer, ForeignKey("leagues.id"))

    leagues = relationship("League", back_populates="season")
    divisions = relationship("Division", back_populates="season")
    contracts = relationship("Contract", back_populates="season")
    player_stats = relationship("PlayerStat", back_populates="season")
    rosters = relationship("Roster", back_populates="season")


class Division(Base):
    __tablename__ = "divisions"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    season_id = Column(Integer, ForeignKey("seasons.id"))
    conference_id = Column(Integer, ForeignKey("conferences.id"))

    season = relationship("Season", back_populates="divisions")
    conference = relationship("Conference", back_populates="divisions")


class Conference(Base):
    __tablename__ = "conferences"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    league_id = Column(Integer, ForeignKey("leagues.id"))

    league = relationship("League", back_populates="conferences")
    divisions = relationship("Division", back_populates="conference")

# ─────────── Team, Player, Roster, Contract ───────────

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    owner_id = Column(Integer, ForeignKey("profiles.id"))
    league_id = Column(Integer, ForeignKey("leagues.id"))

    players = relationship("Player", back_populates="team")
    rosters = relationship("Roster", back_populates="team")
    contracts = relationship("Contract", back_populates="team")
    league = relationship("League", back_populates="teams")


class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True)
    username = Column(String)
    role = Column(String)
    team_id = Column(Integer, ForeignKey("teams.id"))

    team = relationship("Team", back_populates="players")


class Contract(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    season_id = Column(Integer, ForeignKey("seasons.id"))
    player_id = Column(Integer, ForeignKey("profiles.id"))

    season = relationship("Season", back_populates="contracts")
    team = relationship("Team", back_populates="contracts")

# ─────────── Profile, Notification, Webhook, Workflow ───────────

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True)

    notifications = relationship("Notification", back_populates="recipient")
    webhooks = relationship("Webhook", back_populates="creator")
    workflows = relationship("Workflow", back_populates="profile")
    player_stats = relationship("PlayerStat", backref="profile")  # optional reverse

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    recipient_id = Column(Integer, ForeignKey("profiles.id"))

    recipient = relationship("Profile", back_populates="notifications")


class Webhook(Base):
    __tablename__ = "webhooks"
    id = Column(Integer, primary_key=True)
    created_by = Column(Integer, ForeignKey("profiles.id"))

    creator = relationship("Profile", back_populates="webhooks")


class Workflow(Base):
    __tablename__ = "workflows"
    id = Column(Integer, primary_key=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"))
    webhook_id = Column(Integer, ForeignKey("webhooks.id"))

    profile = relationship("Profile", back_populates="workflows")

# ─────────── Matches, Submissions, Results, Stats ───────────

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True)
    league_id = Column(Integer, ForeignKey("leagues.id"))
    season_id = Column(Integer, ForeignKey("seasons.id"))
    division_id = Column(Integer, ForeignKey("divisions.id"))
    team1_id = Column(Integer, ForeignKey("teams.id"))
    team2_id = Column(Integer, ForeignKey("teams.id"))
    winner_id = Column(Integer, ForeignKey("teams.id"))
    scheduled_time = Column(DateTime, default=datetime.datetime.utcnow)

    player_stats = relationship("PlayerStat", back_populates="match")


class MatchSubmission(Base):
    __tablename__ = "match_submissions"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    submitted_by = Column(Integer, ForeignKey("profiles.id"))
    comment = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    submission_hash = Column(String, unique=True, nullable=False)

    __table_args__ = (
        Index("ix_match_submission_hash", "submission_hash"),
    )


class MatchResult(Base):
    __tablename__ = "match_results"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    result_data = Column(Text)


class PlayerStat(Base):
    __tablename__ = "player_stats"

    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    player_id = Column(Integer, ForeignKey("profiles.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    season_id = Column(Integer, ForeignKey("seasons.id"))

    points = Column(Integer, nullable=False)
    assists = Column(Integer, nullable=False)
    rebounds = Column(Integer, nullable=False)
    steals = Column(Integer, nullable=False)
    blocks = Column(Integer, nullable=False)
    turnovers = Column(Integer, nullable=False)
    fouls = Column(Integer, nullable=False)

    stat_hash = Column(String, unique=True, nullable=False)

    __table_args__ = (
        Index("ix_player_stat_hash", "stat_hash"),
    )

    season = relationship("Season", back_populates="player_stats")
    match = relationship("Match", back_populates="player_stats")

# ─────────── Misc Tables ───────────

class Registration(Base):
    __tablename__ = "registrations"
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    league_id = Column(Integer, ForeignKey("leagues.id"))


class Roster(Base):
    __tablename__ = "rosters"
    id = Column(Integer, primary_key=True)
    season_id = Column(Integer, ForeignKey("seasons.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))

    season = relationship("Season", back_populates="rosters")
    team = relationship("Team", back_populates="rosters")


class LeagueSettings(Base):
    __tablename__ = "league_settings"
    id = Column(Integer, primary_key=True)
    league_id = Column(Integer, ForeignKey("leagues.id"))

    league = relationship("League", back_populates="settings")
