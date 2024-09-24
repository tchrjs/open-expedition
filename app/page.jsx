export default function Home() {
    const characters = [
        { name: "tank" },
        { name: "mage" },
        { name: "warrior" },
        { name: "cleric" },
    ];

    return (
        <main className="flex-col justify-center items-center">
            {/** title */}
            <div className="text-white text-center text-lg p-2 border-white border-b-2">
                camp
            </div>
            {/** character potrait display */}
            <div className="w-full grid grid-cols-2 grid-rows-2 p-4 place-items-center gap-2">
                {characters.map((character) => (
                    <div className="flex-col">
                        <div className="w-36 h-36 border-white border-2"></div>
                        <div className="text-white text-center">
                            {character.name}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
