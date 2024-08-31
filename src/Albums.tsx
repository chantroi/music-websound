import { useEffect, useState, useRef } from "react";


export default function Albums({
    setCurrentTab,
}: {
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setCurrentTab("home")}
            >
                X
            </button>
            <h1 className="text-3xl font-bold">Albums</h1>
        </div>
    );
}