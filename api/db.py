import os
from sqlalchemy import create_engine, Column, String, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class Audio(Base):
    __tablename__ = "audio"
    title = Column(String, primary_key=True)
    url = Column(String)
    artist = Column(String)
    cover = Column(String)
    lrc = Column(String, nullable=True)


class Album(Base):
    __tablename__ = "album"
    album = Column(String)
    audio = Column(String)

    __table_args__ = (PrimaryKeyConstraint("album", "audio"),)


class Db:
    def __init__(self):
        db_url = os.getenv("DB_URL")
        self.engine = create_engine(
            db_url, connect_args={"check_same_thread": False}, echo=True
        )
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()

    def add_audio(self, title, url, artist, cover, lrc=None):
        if lrc:
            self.session.add(
                Audio(title=title, url=url, artist=artist, cover=cover, lrc=lrc)
            )
        else:
            self.session.add(Audio(title=title, url=url, artist=artist, cover=cover))
        self.session.commit()

    def add_album(self, album, audio):
        self.session.add(Album(album=album, audio=audio))
        self.session.commit()

    def get_album(self, album=None):
        if not album:
            return self.session.query(Album).all()
        return self.session.query(Album).filter_by(album=album).all()

    def get_audio(self, title):
        return self.session.query(Audio).filter_by(title=title).first()

    def get_audios(self):
        return self.session.query(Audio).all()
