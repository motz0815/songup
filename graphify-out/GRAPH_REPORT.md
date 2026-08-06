# Graph Report - DemocraTune  (2026-08-06)

## Corpus Check
- 89 files · ~183,992 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 454 nodes · 749 edges · 43 communities (34 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `828833c7`
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
- [[_COMMUNITY_Community 14|Community 14]]
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
- [[_COMMUNITY_Community 42|Community 42]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 54 edges
2. `compilerOptions` - 16 edges
3. `api` - 15 edges
4. `compilerOptions` - 13 edges
5. `useAuthedMutation()` - 9 edges
6. `attachNicknames()` - 8 edges
7. `ImageWithFallback()` - 8 edges
8. `Button` - 8 edges
9. `scripts` - 7 edges
10. `weightedQueue()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `PlaylistCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/host/playlist-picker.tsx → src/lib/utils.ts
- `RateButton()` --calls--> `cn()`  [EXTRACTED]
  src/components/room/vote-controls.tsx → src/lib/utils.ts
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `HostPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/host/[code]/page.tsx → src/app/room/not-found.tsx

## Communities (43 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.19
Nodes (8): { auth, signIn, signOut, store, isAuthenticated }, getCurrentUser, mutation, http, getNickname, getNicknameByUserId, setNickname, query

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (27): SchedulerOption, APIPlaylist, Mood, MoodPlaylist, PlaylistCard(), PlaylistPicker(), SchedulerOption, SchedulerPicker() (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (23): LandingBackground(), metadata, viewport, CreateRoom(), cn(), Card(), CardAction(), CardContent() (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (32): devDependencies, concurrently, eslint, eslint-config-next, @eslint/eslintrc, prettier, prettier-plugin-organize-imports, prettier-plugin-tailwindcss (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (21): NicknameForm(), HostPage(), RoomPage(), Room(), ImageWithFallback(), ImageWithFallbackProps, api, components (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (31): dependencies, @auth/core, class-variance-authority, clsx, convex, @convex-dev/auth, convex-helpers, date-fns (+23 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (15): Host(), HostBackground(), HostPlayer(), PlaybackStatus, PlayerSong, PlayerState, RETRYABLE_ERROR_CODES, RoomQRCode() (+7 more)

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

### Community 14 - "Community 14"
Cohesion: 0.40
Nodes (4): DataModel, Doc, Id, TableNames

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

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (14): getUserRating(), NEUTRAL_RATING, tallySongVotes(), UserRating, clampSkipThreshold(), votesRequired(), weightFromScore(), getCurrentSongVotes (+6 more)

### Community 37 - "Community 37"
Cohesion: 0.34
Nodes (13): getUserRatings(), attachNicknames(), bucketByUser(), collectQueue(), fcfsQueue(), getQueueFCFS(), getQueueRoundRobin(), getQueueWeighted() (+5 more)

### Community 38 - "Community 38"
Cohesion: 0.21
Nodes (7): geistMono, geistSans, metadata, convex, ConvexClientProvider(), Providers(), Toaster()

### Community 39 - "Community 39"
Cohesion: 0.18
Nodes (9): crons, AddSongData, addSongToPlaylist, deleteRoomPlaylist, triggers, internal, internalAction, internalMutation (+1 more)

### Community 40 - "Community 40"
Cohesion: 0.18
Nodes (10): addSong, getPersonalQueue, getQueue, getRoomByCode, getRoomById, getSongHistory, getSongsLeftToAdd, isHost (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (6): internalMutation, schedulerValidator, song, cleanExpiredRooms, createRoom, listOwnRooms

### Community 42 - "Community 42"
Cohesion: 0.70
Nodes (4): advanceRoom(), clearSkipVotes(), tallyVoteDocs(), getNextSong()

## Knowledge Gaps
- **195 isolated node(s):** `name`, `version`, `private`, `node`, `packageManager` (+190 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 1`, `Community 4`, `Community 6`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 5` to `Community 3`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _213 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10336817653890824 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0945945945945946 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.11025641025641025 - nodes in this community are weakly interconnected._