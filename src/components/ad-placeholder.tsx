
'use client';

import { useEffect, useState } from 'react';

// Simple HTML sanitizer to prevent XSS attacks
function sanitizeHtml(html: string): string {
    // Remove script tags and event handlers
    const sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\son\w+\s*=\s*[^>\s]+/gi, '')
        .replace(/javascript:/gi, '');
    
    return sanitized;
}

export function AdPlaceholder() {
    const [adCode, setAdCode] = useState<string | null>(null);

    useEffect(() => {
        const code = localStorage.getItem('ad_code');
        if (code) {
            // Sanitize the ad code before setting it
            const sanitizedCode = sanitizeHtml(code);
            setAdCode(sanitizedCode);
        }
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
