"use client";

import { useState } from "react";

const gameStates = {
    start: 0,
    battle: 1,
};

const basePlayerStats = {
    health: 50,
    maxHealth: 50,
    attack: 10,
    shield: 0,
    maxShield: 15,
    energy: 1,
};

const baseEnemyStats = {
    id: 0,
    name: "enemy1",
    health: 50,
    maxHealth: 50,
    attack: 10,
    shield: 15,
    maxShield: 15,
    energy: 0,
};

export default function Home() {
    const [currentGameState, setCurrentGameState] = useState(gameStates.start);
    const [playerStats, setPlayerStats] = useState(basePlayerStats);
    const [isCurrentTurn, setIsCurrentTurn] = useState(true);
    const [enemies, setEnemies] = useState([]);
    const [target, setTarget] = useState(null);

    const onStart = function () {
        setCurrentGameState(gameStates.battle);
        setTarget(null);
        setEnemies([baseEnemyStats]);
    };

    // player actions
    const onBasicAttack = function () {
        setIsCurrentTurn(false);
        setPlayerStats({ ...playerStats, energy: playerStats.energy - 1 });
        let currentTarget = target;

        // If no target is selected, automatically choose a target.
        if (!currentTarget) {
            currentTarget = getRandomArrayValue(enemies);
            setTarget(currentTarget);
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
        let enemiesExist = updateTarget(currentTarget);
        console.log(enemiesExist);
        onTurnEnd(
            { ...playerStats, energy: playerStats.energy - 1 },
            false,
            enemiesExist
        );
    };

    const onSkills = function () {
        setIsCurrentTurn(false);
        onTurnEnd({ ...playerStats, energy: playerStats.energy - 1 });
    };

    const onFocus = function () {
        setIsCurrentTurn(false);
        onTurnEnd(playerStats, true);
    };

    const onGuard = async function () {
        setIsCurrentTurn(false);
        let newPlayerStats = playerStats;
        newPlayerStats.shield = playerStats.shield + 15;
        if (newPlayerStats.shield > playerStats.maxShield)
            newPlayerStats.shield = playerStats.maxShield;
        onTurnEnd({ ...newPlayerStats, energy: newPlayerStats.energy - 1 });
    };

    const onTurnEnd = async function (
        newPlayerStats,
        ignore = false,
        enemiesExist = true
    ) {
        // Check if enemies still exist. If not game ends.
        setPlayerStats(newPlayerStats);
        if (!enemiesExist) {
            console.log("Game Over!");
            setIsCurrentTurn(false);
            setPlayerStats(newPlayerStats);
            return;
        }

        // Check if player still has energy. Ignore when skill builds energy.
        if (!ignore && newPlayerStats.energy > 0) {
            console.log("Game Won!");
            setIsCurrentTurn(true);
            setPlayerStats(newPlayerStats);
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        // enemy performs attack.
        await Promise.all(
            enemies.map(async (enemy) => {
                // Calculate damage.
                let damage = newPlayerStats.shield - enemy.attack;
                if (damage < 0) {
                    newPlayerStats.shield = 0;
                    newPlayerStats.health = newPlayerStats.health + damage;
                    if (newPlayerStats.health < 0) newPlayerStats.health = 0;
                } else {
                    newPlayerStats.shield -= enemy.attack;
                }
                setPlayerStats(newPlayerStats);
                await new Promise((resolve) => setTimeout(resolve, 500));
            })
        );

        // Check player and enemy statuses.
        if (playerStats.health === 0) {
            console.log("Game Over");
            setPlayerStats({ ...newPlayerStats, health: 0 });
        } else {
            setPlayerStats({
                ...newPlayerStats,
                energy: newPlayerStats.energy + 1,
            });
            setIsCurrentTurn(true);
        }
    };

    const updateTarget = function (updatedTarget) {
        if (updatedTarget.health === 0) {
            let newEnemies = enemies.filter(
                (enemy) => enemy.id !== updatedTarget.id
            );
            setEnemies(newEnemies);
            setTarget(null);
            return newEnemies.length > 0;
        } else {
            const updatedEnemies = enemies.map((enemy) =>
                enemy.id === updatedTarget.id ? updatedTarget : enemy
            );
            setEnemies(updatedEnemies);
            setTarget(updatedTarget);
            return true;
        }
    };

    const getRandomArrayValue = function (arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    };

    return (
        <main className="fixed h-dvh w-full">
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
                className={`h-full p-4 ${
                    currentGameState === gameStates.battle ? "" : "hidden"
                }`}
            >
                {/** target stats */}
                <div className="w-full h-1/6">
                    <div className={`${target ? "opacity-1" : "opacity-0"}`}>
                        <div className="flex flex-col gap-1 px-4">
                            <div className="text-white">
                                {target?.name ?? ""}
                            </div>
                            <div className="w-full p-1 border-white border-2 flex">
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
                            <div className="text-white flex justify-start items-center gap-8 text-sm">
                                <div>
                                    {`${
                                        target
                                            ? `HP:${target.health}/${target.maxHealth}`
                                            : ""
                                    }`}
                                </div>
                                <div>{`${
                                    target
                                        ? `SHIELD:${target.shield}/${target.maxShield}`
                                        : ""
                                }`}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/** battle ground */}
                <div className="w-full h-3/6 flex justify-center items-center">
                    {/** player models */}
                    <div className="absolute flex flex-col gap-2 -translate-x-24">
                        <div className="flex flex-col justify-center items-center border-red">
                            <div className="w-5 h-5 bg-blue-800"></div>
                            <div className="w-7 h-12 bg-blue-800"></div>
                        </div>
                        <div className="absolute text-white top-[75px]">
                            you
                        </div>
                    </div>
                    {/** enemy models */}
                    <div className="absolute flex flex-col gap-2 translate-x-24">
                        {enemies.map((enemy) => (
                            <div
                                className="flex flex-col justify-center items-center border-red"
                                key={enemy.id}
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
                {/** player information and movesets */}
                <div className="w-full h-2/6 flex flex-col justify-end gap-3">
                    {/** stats */}
                    <div className="flex flex-col gap-1 px-4">
                        <div className="text-white flex justify-center items-center space-x-4 text-sm">
                            <div>
                                {`HP:${playerStats.health}/${playerStats.maxHealth}`}
                            </div>
                            <div>{`SHIELD:${playerStats.shield}/${playerStats.maxShield}`}</div>
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
                    <div
                        className={`grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-none place-items-center gap-2 ${
                            isCurrentTurn
                                ? ""
                                : "brightness-50 pointer-events-none"
                        }`}
                    >
                        <div
                            className="w-full text-white border-white border-2 text-center py-5"
                            onClick={onBasicAttack}
                        >
                            basic attack
                        </div>
                        <div
                            className="w-full text-white border-white border-2 text-center py-5"
                            onClick={onFocus}
                        >
                            focus
                        </div>
                        <div
                            className="w-full text-white border-white border-2 text-center py-5"
                            onClick={onSkills}
                        >
                            skills
                        </div>
                        <div
                            className="w-full text-white border-white border-2 text-center py-5"
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
