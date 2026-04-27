import { useState } from "react";
import { createContext, useContext } from "react";
import ConfirmModal from "../ui/ConfirmModal";
import { confirmConfig } from "../utils/confirmConfig";

const ConfirmContext = createContext(null);

function ConfirmProvider({ children }) {
    const [options, setOptions] = useState(null); // controls open/close
    const [visibleOptions, setVisibleOptions] = useState(null); // controls UI content
    const [resolver, setResolver] = useState(null);

    const confirm = (opts) => {
        return new Promise((resolve) => {
            const configFromType = confirmConfig[opts.type] || {};

            const finalOptions = {
                ...configFromType,
                ...opts,
            };

            setOptions(finalOptions);
            setVisibleOptions(finalOptions); // 🔥 persist content
            setResolver(() => resolve);
        });
    };

    const handleClose = () => {
        if (resolver) resolver(false);
        setOptions(null); // triggers animation
        setResolver(null);
    };

    const handleConfirm = () => {
        if (resolver) resolver(true);
        setOptions(null);
        setResolver(null);
    };

    const handleAfterLeave = () => {
        // 🔥 clear AFTER animation ends
        setVisibleOptions(null);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            <ConfirmModal
                isOpen={!!options}
                onClose={handleClose}
                onConfirm={handleConfirm}
                onAfterLeave={handleAfterLeave}
                title={visibleOptions?.title}
                description={visibleOptions?.description}
                confirmText={visibleOptions?.confirmText}
                cancelText={visibleOptions?.cancelText || "Cancel"}
                variant={visibleOptions?.variant}
            />
        </ConfirmContext.Provider>
    );
}

function useConfirm() {
    const context = useContext(ConfirmContext);

    if (!context) {
        throw new Error("useConfirm must be used inside ConfirmProvider");
    }

    return context;
}

export { useConfirm, ConfirmProvider };
