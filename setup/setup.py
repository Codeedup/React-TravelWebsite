from pathlib import Path
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import declarative_base, relationship

def find_project_root():
    """
    Scans the current directory and its parents to find the project root.
    It identifies the root by looking for the presence of both 'setup' 
    and 'apiserver' directories.
    """
    cwd = Path.cwd().resolve()
    for candidate in [cwd, *cwd.parents]:
        if (candidate / "setup").exists() and (candidate / "apiserver").exists():
            return candidate
    return cwd

# Define the absolute path where the database file will be stored
PROJECT_ROOT = find_project_root()
DB_PATH = PROJECT_ROOT / "setup" / "travel_planner.db"

# Ensure the 'setup' directory actually exists before we try to put a file inside
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

# Delete the old database file if it exists to ensure a clean boilperplate on every run
if DB_PATH.exists():
    DB_PATH.unlink()
    print(f"{DB_PATH.name} file has been deleted!")

# Create the base class that all our ORM (Object-Relational Mapping) models will inherit from
Base = declarative_base()

# --------------------
# All the tables
# -------------------

# Destination Table

class Destination(Base):
    """
    The main table storing core information about each city/destination.
    Acts as the central hub that most other tables connect to.
    """
    __tablename__ = 'Destinations'

    DestinationID = Column(Integer, primary_key=True)
    CityName = Column(String, nullable=False)
    Country = Column(String, nullable=False)
    Description = Column(String, nullable=False)

    # Relationships to easily access linked data from a Destination object
    activities = relationship("Destination_Activity", back_populates="destination")
    vibes = relationship("Destination_Vibe", back_populates="destination")
    cost_profile = relationship("CostProfile", back_populates="destination", uselist=False) # One-to-One
    weather_records = relationship("WeatherMonthly", back_populates="destination")        # One-to-Many

    def __repr__(self):
        return f"<Destination(City='{self.CityName}', Country='{self.Country}')>"
    

# Cost profile table

class CostProfile(Base):
    """
    Stores budget information for a destination (e.g., Cheap, Medium, Expensive).
    This is a One-to-One relationship with Destinations.
    """
    __tablename__ = 'Cost_Profiles'

    CostID = Column(Integer, primary_key=True)
    # unique=True ensures one destination can only have one cost profile
    DestinationID = Column(Integer, ForeignKey('Destinations.DestinationID'), unique=True, nullable=False)
    BudgetLevel = Column(String, nullable=False)

    destination = relationship("Destination", back_populates="cost_profile")

# Weather table

class WeatherMonthly(Base):
    """
    Stores historical or average climate data. 
    There will be 12 of these records for every 1 Destination (One-to-Many).
    """
    __tablename__ = 'Weather_Monthly'

    WeatherID = Column(Integer, primary_key=True)
    DestinationID = Column(Integer, ForeignKey('Destinations.DestinationID'), nullable=False)
    Month = Column(Integer, nullable=False)
    AvgTempC = Column(Float)
    RainfallMM = Column(Float)

    destination = relationship("Destination", back_populates="weather_records")


# Table for activities

class Activity(Base):
    """
    A lookup table of things to do (e.g., "Shopping", "Hiking").
    """
    __tablename__ = 'Activities'

    ActivityID = Column(Integer, primary_key=True)
    ActivityName = Column(String, nullable=False)

    destinations = relationship("Destination_Activity", back_populates="activity")

    def __repr__(self):
        return f"<Activity(Name='{self.ActivityName}')>"
    

# Table with vibes

class Travel_Vibe(Base):
    """
    A lookup table for the "feel" or "energy" of a trip (e.g., "Romantic Charm").
    """
    __tablename__ = 'Travel_Vibes'

    VibeID = Column(Integer, primary_key=True)
    VibeName = Column(String, nullable=False)

    destinations = relationship("Destination_Vibe", back_populates="vibe")

    def __repr__(self):
        return f"<Vibe(Name='{self.VibeName}')>"

# ---------------------
# ASSOCIATION TABLES (For Many-to-Many Relationships)
# ---------------------

class Destination_Activity(Base):
    """
    Links Destinations and Activities. 
    Also stores a custom description specific to doing that activity in that city.
    """
    __tablename__ = 'Destinations_Activities'

    DestinationID = Column(Integer, ForeignKey('Destinations.DestinationID'), primary_key=True)
    ActivityID = Column(Integer, ForeignKey('Activities.ActivityID'), primary_key=True)
    Spotlight_Description = Column(String)

    destination = relationship("Destination", back_populates="activities")
    activity = relationship("Activity", back_populates="destinations")


class Destination_Vibe(Base):
    """
    Links Destinations and Travel_Vibes.
    Allows one city to have many vibes, and one vibe to apply to many cities.
    """
    __tablename__ = 'Destination_Vibes'

    DestinationID = Column(Integer, ForeignKey('Destinations.DestinationID'), primary_key=True)
    VibeID = Column(Integer, ForeignKey('Travel_Vibes.VibeID'), primary_key=True)

    destination = relationship("Destination", back_populates="vibes")
    vibe = relationship("Travel_Vibe", back_populates="destinations")

# ---------------------
# Building the database
# ---------------

try:
    engine = create_engine(f"sqlite:///{DB_PATH.as_posix()}", echo=False)
    
    # Read all the classes defined above and generate the actual SQLite tables
    Base.metadata.create_all(engine)
    
    # Print if it works
    print(f"The database '{DB_PATH.name}' has been created succesfuly")

except Exception as e:
    # If something fails print the exact error
    print(f"[ERROR] Failed to build the database.")
    print(f"Reason: {e}")