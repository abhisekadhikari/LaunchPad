import React from "react"
import { BackgroundLines } from "../components/ui/Background"

export function Hero() {
    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                Welcome To, <br /> Launch Pad.
            </h2>
            <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
                Effortless, Automated Front-End Deployments Streamline your web
                development process with our platform, designed to simplify
                deployment and accelerate your project's launch—no backend
                worries, just code.
            </p>
        </BackgroundLines>
    )
}
