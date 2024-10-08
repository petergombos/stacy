import { db } from "@/lib/db";
import { validateApiToken } from "@/lib/validate-api-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validToken = await validateApiToken(token);
  if (!validToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const articlesList = await db.query.articles.findMany({
    where: (article, { eq, and }) =>
      and(
        eq(article.projectId, validToken.projectId),
        eq(article.status, "published")
      ),
    columns: {
      id: true,
      title: true,
      description: true,
      slug: true,
      image: true,
      publishedAt: true,
    },
    orderBy: (article, { desc }) => [desc(article.publishedAt)],
  });

  return NextResponse.json(articlesList);
}
