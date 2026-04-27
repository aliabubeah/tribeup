import TribeCard from "./TribeCard";

function DiscoverTribes() {
    const tribes = [];

    return (
        <div className="space-y-3">
            {tribes.map((tribe) => (
                <TribeCard key={tribe.id} tribe={tribe} />
            ))}
        </div>
    );
}

export default DiscoverTribes;
