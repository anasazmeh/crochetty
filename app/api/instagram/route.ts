import { NextResponse } from 'next/server';

export async function GET() {
    // In a real implementation, this would connect to the Instagram Graph API
    // and use the database to cache the results.
    // For now, we return the mock data as specified.

    const posts = [
        { id: '1', src: "https://images.unsplash.com/photo-1615875221248-d3b8f802972e?q=80&w=400&auto=format&fit=crop", alt: "Crochet detail" },
        { id: '2', src: "https://images.unsplash.com/photo-1549643276-fbc2bd5f1f56?q=80&w=400&auto=format&fit=crop", alt: "Yarn texture" },
        { id: '3', src: "https://images.unsplash.com/photo-1601366533287-59b97dbcacf1?q=80&w=400&auto=format&fit=crop", alt: "Knitting pattern" },
        { id: '4', src: "https://images.unsplash.com/photo-1629007469389-9e85501fb3a2?q=80&w=400&auto=format&fit=crop", alt: "Finished sweater" },
        { id: '5', src: "https://images.unsplash.com/photo-1584666795022-7201c7ce6952?q=80&w=400&auto=format&fit=crop", alt: "Cozy vibes" },
        { id: '6', src: "https://images.unsplash.com/photo-1582236894042-32b0f34fb44a?q=80&w=400&auto=format&fit=crop", alt: "Handmade tag" },
    ];

    return NextResponse.json({ posts });
}
