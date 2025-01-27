import Image from "next/image"

export function HostBackground({ videoId }: { videoId?: string }) {
    return (
        <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden bg-gradient-to-br from-slate-500 to-indigo-950">
            {videoId && (
                <>
                    <Image
                        src={`https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`}
                        className="absolute -top-[50%] z-10 aspect-square w-[200%] animate-rotate mix-blend-luminosity blur-3xl"
                        width={600}
                        height={600}
                        alt="SongUp background"
                        unoptimized
                    />
                    <Image
                        src={`https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`}
                        width={600}
                        height={600}
                        className="absolute -top-[50%] aspect-square w-[200%] animate-rotate blur-3xl delay-10000 direction-reverse"
                        alt="SongUp background"
                        unoptimized
                    />
                </>
            )}
        </div>
    )
}
