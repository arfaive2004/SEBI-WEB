import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base


def now():
    return datetime.datetime.utcnow()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    broker_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=now)

    clients = relationship("Client", back_populates="owner")
    margin_trades = relationship("MarginTrade", back_populates="owner")
    watchdog_trades = relationship("WatchdogTrade", back_populates="owner")


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null = global demo data
    is_demo = Column(Boolean, default=False)

    client_code = Column(String, index=True)
    full_name = Column(String)
    pan_masked = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    address = Column(String, nullable=True)
    kyc_status = Column(String, default="Verified")
    kyc_expiry_date = Column(DateTime, nullable=True)
    notified = Column(Boolean, default=False)
    profit = Column(Float, default=0.0)
    status = Column(String, default="Up")  # Up / Down for the dashboard badge
    created_at = Column(DateTime, default=now)

    owner = relationship("User", back_populates="clients")


class MarginTrade(Base):
    __tablename__ = "margin_trades"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_demo = Column(Boolean, default=False)

    client_id = Column(String)
    stock = Column(String)
    trade_type = Column(String)  # BUY / SELL
    margin_required = Column(Float)
    margin_available = Column(Float)
    margin_status = Column(String)  # OK / issue
    created_at = Column(DateTime, default=now)

    owner = relationship("User", back_populates="margin_trades")


class WatchdogTrade(Base):
    __tablename__ = "watchdog_trades"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_demo = Column(Boolean, default=False)

    client_id = Column(String)
    stock = Column(String)
    trade_type = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    created_at = Column(DateTime, default=now)

    owner = relationship("User", back_populates="watchdog_trades")


class FundsCheckLog(Base):
    __tablename__ = "funds_check_logs"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    actual_balance = Column(Float)
    required_funds = Column(Float)
    surplus = Column(Float)
    status = Column(String)
    created_at = Column(DateTime, default=now)
