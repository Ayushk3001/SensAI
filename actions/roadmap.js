"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  return user;
}

export async function getRoadmaps() {
  const user = await getCurrentUser();

  return await db.roadmap.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
}

export async function getRoadmap(id) {
  const user = await getCurrentUser();

  return await db.roadmap.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteRoadmap(id) {
  const user = await getCurrentUser();

  await db.roadmap.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/roadmap");
  revalidatePath("/roadmap/new");
  revalidatePath("/dashboard");
}

export async function updateRoadmapProgress(roadmapId, completedNodeIds) {
  const user = await getCurrentUser();

  const roadmap = await db.roadmap.updateMany({
    where: {
      id: roadmapId,
      userId: user.id,
    },
    data: {
      completedNodeIds: completedNodeIds || [],
    },
  });

  revalidatePath("/roadmap");
  revalidatePath("/dashboard");

  return roadmap;
}
