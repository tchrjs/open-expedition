"use client";

import { useState } from "react";

const gameStates = {
    start: 0,
    battle: 1,
};

const basePlayerStats = {
    health: 100,
    maxHealth: 100,
    attack: 10,
    shield: 0,
    energy: 0,
};

const baseEnemyStats = {
    id: 0,
    name: "enemy1",
    health: 100,
    maxHealth: 100,
    attack: 10,
    shield: 15,
    energy: 0,
};

export default function Home() {
    const [currentGameState, setCurrentGameState] = useState(gameStates.start);
    const [playerStats, setPlayerStats] = useState(basePlayerStats);
    const [enemies, setEnemies] = useState([]);
    const [target, setTarget] = useState(null);

    const onStart = function () {
        setCurrentGameState(gameStates.battle);
        setTarget(null);
        setEnemies([baseEnemyStats]);
    };

    const onBasicAttack = function () {
        let currentTarget = target;

        // If no target is selected, automatically choose a target.
        if (!currentTarget) {
            currentTarget = getRandomArrayValue(enemies);
        }

        // Calculate damage.
        let damage = currentTarget.shield - playerStats.attack;
        if (damage <= 0) {
            currentTarget.shield = 0;
            currentTarget.health = currentTarget.health + damage;
            if (currentTarget.health < 0) currentTarget.health = 0;
        } else {
            currentTarget.shield -= playerStats.attack;
        }

        // Update target info.
        updateTarget(currentTarget);
    };

    const onSkills = function () {};
    const onFocus = function () {};
    const onGuard = function () {};

    const updateTarget = function (updatedTarget) {
        const updatedEnemies = enemies.map((enemy) =>
            enemy.id === updatedTarget.id ? updatedTarget : enemy
        );
        setEnemies(updatedEnemies);
        setTarget(updatedTarget);
    };

    const getRandomArrayValue = function (arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        console.log(arr[randomIndex]);
        return arr[randomIndex];
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
                <div className="h-3/5 m-2 flex justify-center items-center">
                    {/** target stats */}
                    <div
                        className={`w-full h-full flex flex-col p-4 gap-1 ${
                            target ? "" : "hidden"
                        }`}
                    >
                        <div className=" text-white">{target?.name ?? ""}</div>
                        <div className="w-full p-1 border-white border-2 flex justify-start">
                            <div
                                className="h-2 bg-red-700"
                                style={{
                                    width: `${
                                        target
                                            ? (target.health /
                                                  target.maxHealth) *
                                              100
                                            : 0
                                    }%`,
                                }}
                            ></div>
                            <div
                                className="h-2 bg-orange-600"
                                style={{
                                    width: `${
                                        target
                                            ? (target.shield /
                                                  target.maxHealth) *
                                              100
                                            : 0
                                    }%`,
                                }}
                            ></div>
                        </div>
                        <div className="text-white flex justify-start items-center gap-8">
                            <div>
                                {`${
                                    target
                                        ? `HP:${target.health}/${target.maxHealth}`
                                        : ""
                                }`}
                            </div>
                            <div>{`${
                                target ? `SHIELD:${target.shield}` : ""
                            }`}</div>
                        </div>
                    </div>

                    {/** player models */}
                    <div className="absolute flex flex-col gap-2 left-0 ml-14">
                        <div className="flex flex-col justify-center items-center border-red">
                            <div className="w-5 h-5 bg-blue-800"></div>
                            <div className="w-7 h-12 bg-blue-800"></div>
                        </div>
                        <div className="absolute text-white top-[75px]">
                            you
                        </div>
                    </div>
                    {/** enemy models */}
                    <div className="absolute flex flex-col gap-2 right-0 mr-14">
                        {enemies.map((enemy) => (
                            <div
                                className="flex flex-col justify-center items-center border-red"
                                onClick={() => {
                                    setTarget(target === enemy ? null : enemy);
                                }}
                            >
                                {/** target selector symbol */}
                                <div
                                    className={`absolute w-20 h-20 b-2 border-white flex items-center justify-center ${
                                        target === enemy ? "" : "hidden"
                                    }`}
                                >
                                    <div className="w-5 h-5 absolute top-0 left-0 border-t-2 border-l-2 border-white rounded-md"></div>
                                    <div className="w-5 h-5 absolute top-0 right-0 border-t-2 border-r-2 border-white rounded-md"></div>
                                    <div className="w-5 h-5 absolute bottom-0 left-0 border-b-2 border-l-2 border-white rounded-md"></div>
                                    <div className="w-5 h-5 absolute bottom-0 right-0 border-b-2 border-r-2 border-white rounded-md"></div>
                                    <div className="h-5 absolute border-r-2 border-white"></div>
                                    <div className="w-5 absolute border-b-2 border-white"></div>
                                </div>
                                <div className="w-5 h-5 bg-red-700"></div>
                                <div className="w-7 h-12 bg-red-700"></div>
                                <div className="absolute text-white top-[75px]">
                                    {enemy.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/** player information and moveset */}
                <div className="h-2/5 m-2">
                    {/** stats */}
                    <div className="flex flex-col gap-1 p-4">
                        <div className="text-white flex justify-center items-center gap-8">
                            <div>
                                {`HP:${playerStats.health}/${playerStats.maxHealth}`}
                            </div>
                            <div>{`SHIELD:${playerStats.shield}`}</div>
                            <div>{`ATK:${playerStats.attack}`}</div>
                            <div>{`ENERGY:${playerStats.energy}`}</div>
                        </div>
                        <div className="w-full p-1 border-white border-2 flex">
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
                            <div
                                className="h-2 bg-blue-600"
                                style={{
                                    width: `${
                                        (playerStats.shield /
                                            playerStats.maxHealth) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    {/** move options */}
                    <div className="grid grid-cols-2 grid-rows-2 place-items-center gap-2">
                        <div
                            className="w-full text-white border-white border-2 text-center py-6"
                            onClick={onBasicAttack}
                        >
                            basic attack
                        </div>
                        <div
                            className="w-full text-white border-white border-2 text-center py-6"
                            onClick={onFocus}
                        >
                            focus
                        </div>
                        <div
                            className="w-full text-white border-white border-2 text-center py-6"
                            onClick={onSkills}
                        >
                            skills
                        </div>
                        <div
                            className="w-full text-white border-white border-2 text-center py-6"
                            onClick={onGuard}
                        >
                            guard
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
