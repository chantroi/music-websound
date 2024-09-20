from sqlalchemy import create_engine, Column, String, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from env import DB_URL

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
    title = Column(String, primary_key=True)
    author = Column(String)
    des = Column(String, default="")


class AlbumAudio(Base):
    __tablename__ = "albumaudio"
    album = Column(String)
    audio = Column(String)

    __table_args__ = (PrimaryKeyConstraint("album", "audio"),)


class Db:
    def __init__(self):
        self.engine = create_engine(
            DB_URL, connect_args={"check_same_thread": False}, echo=True, pool_pre_ping=True
        )
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()

    def create_album(self, title, author, des):
        if self.session.query(Album).count() != 0:
            return False
        if des:
            self.session.add(Album(title=title, author=author, des=des))
        else:
            self.session.add(Album(title=title, author=author))
        self.session.commit()
        return True

    def list_albums(self):
        return self.session.query(Album).all()

    def add_audio(self, title, url, artist, cover, lrc=None):
        if lrc:
            self.session.add(
                Audio(title=title, url=url, artist=artist, cover=cover, lrc=lrc)
            )
        else:
            self.session.add(Audio(title=title, url=url, artist=artist, cover=cover))
        self.session.commit()

    def add_album(self, album, audio):
        self.session.merge(AlbumAudio(album=album, audio=audio))
        self.session.commit()

    def get_album(self, album=None):
        if self.session.query(Album).count() == 0:
            return None
        if not album:
            return self.session.query(AlbumAudio).all()
        return self.session.query(AlbumAudio).filter_by(album=album).all()

    def get_audio(self, title):
        return self.session.query(Audio).filter_by(title=title).first()

    def get_audios(self):
        return self.session.query(Audio).all()
    
    def close(self):
        self.session.close()
