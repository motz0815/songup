# DemocraTune

DemocraTune makes queuing songs from everyone easy and fair. 🎵

## 🎉 What is DemocraTune?

DemocraTune is an open-source, privacy-friendly music queue system. Hosts can control a central screen while everyone else contributes to the playlist simply by scanning a QR code. No logins, no hassle, just music.

## 🔀 Upstream Project

DemocraTune is a fork of [SongUp](https://github.com/motz0815/songup) originally created by Matthias ([@motz0815](https://github.com/motz0815)).

SongUp is an open-source, privacy-friendly music queue system.
This fork builds on SongUp by adding alternative queue scheduling algorithms,
user-weighted fairness, and experimental features such as voting and karaoke mode.

## Features

- [X] **🔓 No Logins Required**
  Host and users can use DemocraTune without creating an account.

- [X] **💸 Free for Everyone**
  DemocraTune is completely free to use.

- [X] **📺 Perfect for Large Screens**
  A dedicated host mode designed for TV or laptop screens.
  (Works flawlessly on mobile too.)

- [X] **2️⃣ Queue Management**
  Hosts can choose one of several queueing algorithms, to fairly select songs from the recommendations.
  - ***First Come First Served*** - The default scheduling system inherited from SongUp.
  - ***Round Robin*** - A round robin implementation, taking a song from each user in turn.
  - ***DemocraSchedule*** - A round robin variation using a user's song voting record. Implemented as
    smooth weighted round robin, so well-rated users get proportionally more turns while everyone
    stays interleaved.
  
- [X] **🎶 Never Silence**
  When creating a room, hosts can choose a fallback playlist that will play when no one has added a song to the queue, while
  songs that users add will always have priority over fallback songs.

- [X] **✅️❌ Voting**
  One vote per person per song, up or down. A downvote is also a request to end the song: once enough of
  the room has cast one, it stops. Hosts set that threshold as a share of the people *currently* in the
  room, so it stays meaningful as the party fills up and empties out.

- [X] **⭐ User Rating**
  Votes follow whoever queued the song. Higher rated users get more priority to keep adding songs
  (depending on scheduling algorithm!) — and because the downvotes that cut a song short are counted too,
  getting voted off costs you your turn. Ratings are scoped to a room, and hosts can choose how many of a
  user's recent songs still count.

- [X] **📜 Queue History**
  Ever liked a song but forgot what the song's name was? With queue history, you can see which songs have been played,
  and never have to Shazam again! Really like the songs that have been played? Save the whole history to your own
  YouTube playlist!

- [X] **📤 Take It Home**
  Played songs are catalogued by what they *are*, not by their YouTube id, so the night can leave YouTube.
  Each song in the history links out to wherever else it can be heard — Amazon Music, Tidal, Deezer,
  Pandora and more — and the whole room's history can be pushed into a private Spotify playlist.

  The Spotify connection happens entirely in your browser: DemocraTune never sees the access token, and
  doesn't keep one. Set `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` and register `<your-origin>/spotify/callback` as a
  redirect URI to enable it.

- [ ] **🎤 Karaoke Mode**
  Special karaoke mode with synced lyrics.

## 📜 License

This project is licensed under the [AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html).
