# Graph Report - DemocraTune  (2026-08-07)

## Corpus Check
- 96 files · ~188,738 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 500 nodes · 841 edges · 41 communities (33 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f770ab20`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 60 edges
2. `compilerOptions` - 16 edges
3. `api` - 16 edges
4. `compilerOptions` - 13 edges
5. `useAuthedMutation()` - 9 edges
6. `attachNicknames()` - 8 edges
7. `ImageWithFallback()` - 8 edges
8. `Button` - 8 edges
9. `scripts` - 7 edges
10. `advanceRoom()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `PlaylistCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/host/playlist-picker.tsx → src/lib/utils.ts
- `RateButton()` --calls--> `cn()`  [EXTRACTED]
  src/components/room/vote-controls.tsx → src/lib/utils.ts
- `VoteButton()` --calls--> `cn()`  [EXTRACTED]
  src/components/room/vote-controls.tsx → src/lib/utils.ts
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts

## Communities (41 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (6): { auth, signIn, signOut, store, isAuthenticated }, getCurrentUser, ExportedTrack, getRoomExport, http, query

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (24): CreateRoom(), SchedulerOption, APIPlaylist, Mood, MoodPlaylist, PlaylistCard(), PlaylistPicker(), SchedulerOption (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (34): LandingBackground(), metadata, viewport, HostPlayer(), PlaybackStatus, PlayerSong, PlayerState, RETRYABLE_ERROR_CODES (+26 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (15): devDependencies, concurrently, eslint, eslint-config-next, @eslint/eslintrc, prettier, prettier-plugin-organize-imports, prettier-plugin-tailwindcss (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (32): NicknameForm(), Host(), HostPage(), RoomPage(), Room(), ImageWithFallback(), ImageWithFallbackProps, api (+24 more)

### Community 5 - "Community 5"
Cohesion: 0.04
Nodes (48): dependencies, @auth/core, class-variance-authority, clsx, convex, @convex-dev/auth, convex-helpers, date-fns (+40 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (20): base64Url(), beginAuthorization(), call(), challengeFor(), completeAuthorization(), currentToken(), exportPlaylist(), ExportProgress (+12 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, allowSyntheticDefaultImports, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.31
Nodes (8): cors_response(), get_cors_origin(), get_room_id_from_path(), lambda_handler(), Add CORS headers to response, Determine allowed CORS origin, Extract room_id from path like /api/rooms/{room_id}/playlist, Handle playlist-related requests

### Community 11 - "Community 11"
Cohesion: 0.38
Nodes (6): cors_response(), get_cors_origin(), lambda_handler(), Handle mood categories requests, Add CORS headers to response, Determine allowed CORS origin

### Community 12 - "Community 12"
Cohesion: 0.38
Nodes (6): cors_response(), get_cors_origin(), lambda_handler(), Handle mood playlists requests, Add CORS headers to response, Determine allowed CORS origin

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (13): cors_response(), get_cors_origin(), lambda_handler(), normalize(), Keep only songs that will actually play inside an iframe.      YouTube's oEmbed, Handle search requests, Add CORS headers to response, Determine allowed CORS origin (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): code:ts (// convex/myFunctions.ts), code:ts (const data = useQuery(api.myFunctions.myQueryFunction, {), code:ts (// convex/myFunctions.ts), code:ts (const mutation = useMutation(api.myFunctions.myMutationFunct), Welcome to your Convex functions directory!

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (5): DemocraTune, Features, 📜 License, 🔀 Upstream Project, 🎉 What is DemocraTune?

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (5): ActionCtx, DatabaseReader, DatabaseWriter, MutationCtx, QueryCtx

### Community 18 - "Community 18"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (3): jwk, jwks, publicPem

### Community 33 - "Community 33"
Cohesion: 0.20
Nodes (8): fingerprint(), normalise(), ENTITY_PREFIX_TO_PROVIDER, getTrack, OdesliResponse, resolveTrack, saveResolution, internalQuery

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (15): getUserRating(), NEUTRAL_RATING, tallySongVotes(), tallyVoteDocs(), UserRating, clampSkipThreshold(), votesRequired(), weightFromScore() (+7 more)

### Community 37 - "Community 37"
Cohesion: 0.34
Nodes (13): getUserRatings(), attachNicknames(), bucketByUser(), collectQueue(), fcfsQueue(), getQueueFCFS(), getQueueRoundRobin(), getQueueWeighted() (+5 more)

### Community 38 - "Community 38"
Cohesion: 0.21
Nodes (7): geistMono, geistSans, metadata, convex, ConvexClientProvider(), Providers(), Toaster()

### Community 39 - "Community 39"
Cohesion: 0.17
Nodes (11): AddSongData, addSongToPlaylist, deleteRoomPlaylist, mutation, triggers, getNickname, getNicknameByUserId, setNickname (+3 more)

### Community 40 - "Community 40"
Cohesion: 0.14
Nodes (16): crons, advanceRoom(), clearSkipVotes(), addSong, getPersonalQueue, getQueue, getRoomByCode, getRoomById (+8 more)

### Community 41 - "Community 41"
Cohesion: 0.14
Nodes (10): internalMutation, schedulerValidator, song, DataModel, Doc, Id, TableNames, cleanExpiredRooms (+2 more)

## Knowledge Gaps
- **206 isolated node(s):** `name`, `version`, `private`, `node`, `packageManager` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 1`, `Community 4`, `Community 6`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `api` connect `Community 4` to `Community 1`, `Community 2`, `Community 6`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _224 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06561085972850679 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.07656341320864991 - nodes in this community are weakly interconnected._