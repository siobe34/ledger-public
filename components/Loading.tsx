import { motion } from "framer-motion";

export const Loading = () => {
    return (
        <div className='mt-[10vh] flex h-24 w-24 items-center justify-center'>
            <motion.div
                className='h-full w-full border-8 border-borderBase'
                style={{ borderTop: "8px solid rgb(var(--primary))", borderRadius: "50%" }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
            />
        </div>
    );
};
