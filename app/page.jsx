"use client";

import { useState } from "react";

const gameStates = {
    start: 0,
    battle: 1,
};

export default function Home() {
    const [currentGameState, setCurrentGameState] = useState(gameStates.start);
    const [playerStats, updatePlayerStats] = useState({
        health: 10,
        maxHealth: 10,
        attack: 10,
        defense: 10,
        energy: 0,
    });

    const onStart = function () {
        setCurrentGameState(gameStates.battle);
    };

    return (
        <main className="fixed h-screen w-full">
            {/** start screen */}
            <div
                className={`h-full flex flex-col justify-center items-center ${
                    currentGameState === gameStates.start ? "" : "hidden"
                }`}
            >
                {/** title */}
                <div className="h-1/2 w-full flex justify-center items-center">
                    <div className="w-2/4 text-white text-center p-2 text-2xl">
                        open expedition
                    </div>
                </div>
                {/** start button */}
                <div className="h-1/2 w-full flex justify-center">
                    <button
                        className="w-2/4 h-12 text-white border-white border-2 text-center p-2"
                        onClick={onStart}
                        onPoint
                    >
                        start
                    </button>
                </div>
            </div>
            {/** battle screen */}
            <div
                className={`h-full ${
                    currentGameState === gameStates.battle ? "" : "hidden"
                }`}
            >
                {/** battle ground */}
                <div className="h-3/5 m-2"></div>
                {/** player */}
                <div className="h-2/5 m-2">
                    {/** stats */}
                    <div className="flex flex-col gap-1 p-4">
                        <div className="text-white flex justify-center items-center gap-8">
                            <div>
                                {`HP:${playerStats.health}/${playerStats.maxHealth}`}
                            </div>
                            <div>{`DEF:${playerStats.defense}`}</div>
                            <div>{`ATK:${playerStats.attack}`}</div>
                            <div>{`ENERGY:${playerStats.energy}`}</div>
                        </div>
                        <div className="w-full h-full p-1 border-white border-2 flex justify-start">
                            <div
                                className="h-2 bg-white"
                                style={{
                                    width: `${
                                        (playerStats.health /
                                            playerStats.maxHealth) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    {/** move options */}
                    <div className="grid grid-cols-2 grid-rows-2 place-items-center gap-2">
                        <div className="w-full text-white border-white border-2 text-center py-6">
                            basic attack
                        </div>
                        <div className="w-full text-white border-white border-2 text-center py-6">
                            focus
                        </div>
                        <div className="w-full text-white border-white border-2 text-center py-6">
                            skills
                        </div>
                        <div className="w-full text-white border-white border-2 text-center py-6">
                            guard
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
