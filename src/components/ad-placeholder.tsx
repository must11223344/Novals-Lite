
'use client';

import { useEffect, useState } from 'react';

export function AdPlaceholder() {
    const [adCode, setAdCode] = useState<string | null>(null);

    useEffect(() => {
        const code = localStorage.getItem('ad_code');
        setAdCode(code);
    }, []);

    if (!adCode) {
        return null; // Don't render anything if there's no ad code
    }

    return (
        <div 
            className="my-4 p-4 border-2 border-dashed rounded-lg text-center bg-muted/30"
            dangerouslySetInnerHTML={{ __html: adCode }}
        />
    );
}
