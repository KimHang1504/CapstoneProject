"use client";

import Image from "next/image";
import mascot from "../../../../public/mascot.png";

type Props = {
    title: string;
    subtitle: string;
};

export default function MascotPanel({ title, subtitle }: Props) {
    return (
        <div className="relative hidden md:flex flex-col justify-center items-center 
    bg-gradient-to-b from-[#F7AEF8] to-[#8093F1] 
    p-10 w-1/2 text-white overflow-hidden">

            {/* Hearts background */}

            <div className="absolute top-10 left-10 text-white/40 text-3xl animate-float">❤</div>
            <div className="absolute top-24 left-32 text-white/30 text-xl animate-float delay-200">❤</div>
            <div className="absolute top-16 right-24 text-white/40 text-2xl animate-float delay-300">❤</div>
            <div className="absolute top-40 right-10 text-white/30 text-xl animate-float delay-500">❤</div>

            <div className="absolute top-52 left-20 text-white/20 text-lg animate-float delay-700">❤</div>
            <div className="absolute bottom-40 left-10 text-white/40 text-2xl animate-float delay-900">❤</div>
            <div className="absolute bottom-28 left-36 text-white/30 text-xl animate-float delay-1000">❤</div>

            <div className="absolute bottom-16 right-16 text-white/40 text-3xl animate-float delay-200">❤</div>
            <div className="absolute bottom-32 right-32 text-white/30 text-xl animate-float delay-400">❤</div>
            <div className="absolute bottom-20 right-44 text-white/20 text-lg animate-float delay-600">❤</div>



            <div className="relative flex flex-col items-center justify-center">

                <div className="relative mb-10 flex items-center justify-center">

                    <div className="bg-white/20 backdrop-blur-md px-12 py-8 rounded-[120px] text-center shadow-lg">

                        <h2 className="text-4xl font-extrabold text-white drop-shadow-md">
                            {title}
                        </h2>

                        <p className="text-white/90 mt-2">
                            {subtitle}
                        </p>

                    </div>

                    <div className="absolute -bottom-10 left-1/2 translate-x-12 w-6 h-6 bg-white/30 rounded-full"></div>
                    <div className="absolute -bottom-18 left-1/2 translate-x-10 w-4 h-4 bg-white/30 rounded-full"></div>

                </div>

                <Image src={mascot} alt="Mascot" className="w-150" />

            </div>
        </div>
    );
}