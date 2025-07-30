import Image from "next/image"

export function HostBackground({ videoId }: { videoId?: string }) {
    return (
        <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden bg-gradient-to-br from-slate-500 to-indigo-950">
            {videoId && (
                <>
                    {/* <div className="absolute inset-0 z-10 bg-black/30" /> */}
                    <Image
                        src={`https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`}
                        className="animate-rotate absolute z-10 aspect-square h-screen w-screen origin-center scale-200 mix-blend-color blur-3xl"
                        width={600}
                        height={600}
                        alt="SongUp background"
                        unoptimized
                    />
                    <Image
                        src={`https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`}
                        width={600}
                        height={600}
                        className="direction-reverse animate-rotate absolute aspect-square h-screen w-screen origin-center scale-200 blur-3xl delay-10000"
                        alt="SongUp background"
                        unoptimized
                    />
                </>
            )}
        </div>
    )
}
