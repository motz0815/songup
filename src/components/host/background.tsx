import Image from "next/image"

export function HostBackground({ videoId }: { videoId?: string }) {
    return (
        <div className="bg-night absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(8,120,255,0.2),transparent_32%),radial-gradient(circle_at_84%_82%,rgba(255,89,61,0.18),transparent_30%)]" />
            {videoId && (
                <>
                    {/* This darkens the image a bit to show the white text better */}
                    <div className="bg-night/45 absolute inset-0 z-10" />
                    <Image
                        src={`https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`}
                        className="animate-rotate absolute z-0 aspect-square h-screen w-screen origin-center scale-200 mix-blend-color blur-3xl"
                        width={600}
                        height={600}
                        alt="DemocraTune background"
                        unoptimized
                    />
                    <Image
                        src={`https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`}
                        width={600}
                        height={600}
                        className="direction-reverse animate-rotate absolute z-0 aspect-square h-screen w-screen origin-center scale-200 blur-3xl delay-10000"
                        alt="DemocraTune background"
                        unoptimized
                    />
                </>
            )}
        </div>
    )
}
