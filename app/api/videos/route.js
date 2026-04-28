import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Bypass Next.js strict bundling using a dynamic require
    const ytSearch = require("yt-search");

    // Search YouTube
    const searchResult = await ytSearch(`${topic} tutorial for beginners`);
    
    // Grab the top 3 videos
    const topVideos = searchResult.videos.slice(0, 3).map(vid => ({
      title: vid.title,
      url: vid.url,
      thumbnail: vid.thumbnail,
      author: vid.author.name,
      duration: vid.timestamp
    }));

    return NextResponse.json({ videos: topVideos });
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
