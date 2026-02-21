function SplashScreen() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-5">
            <div className="flex grow items-center justify-center">
                <img
                    src="/السهم.png"
                    className="relative h-16 w-16 rounded-full"
                />
                <img
                    src="/الشكل.png"
                    className="absolute h-64 w-64 animate-spin-slow rounded-full"
                />
            </div>
            <h1 className="text-3xl font-semibold text-tribe-500">TribeUp</h1>
        </div>
    );
}

export default SplashScreen;
