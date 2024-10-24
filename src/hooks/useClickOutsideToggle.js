import { useEffect, useRef, useState } from 'react';

// Closes menu from toggle option is user clicks outside
const useClickOutsideToggle = () => {
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setExpanded(false)
            }
        };

        document.addEventListener('mouseup', handleClickOutside);
        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, [ref]);
    return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle