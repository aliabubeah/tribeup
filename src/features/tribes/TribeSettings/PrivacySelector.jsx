function PrivacySelector({ value, onChange }) {
    const options = [
        {
            key: "public",
            title: "Public",
            description:
                "any one can see who's in the tribe and what they post.",
            icon: "public",
        },
        {
            key: "private",
            title: "Private",
            description: "Only members can see posts and who's in the tribe.",
            icon: "lock",
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            {options.map((opt) => {
                const selected = value === opt.key;

                return (
                    <button
                        key={opt.key}
                        onClick={() => onChange(opt.key)}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                            selected
                                ? "border-purple-500 bg-purple-50 ring-1 ring-purple-400"
                                : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                    >
                        {/* Icon */}
                        <span className="icon-outlined text-xl text-gray-700">
                            {opt.icon}
                        </span>

                        {/* Text */}
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {opt.title}
                            </p>
                            <p className="text-xs text-gray-500">
                                {opt.description}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export default PrivacySelector;
