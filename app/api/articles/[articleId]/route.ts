import { db } from "@/lib/db";
import { validateApiToken } from "@/lib/validate-api-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { articleId: string } }
) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validToken = await validateApiToken(token);
  if (!validToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const article = await db.query.articles.findFirst({
    where: (article, { eq, and }) =>
      and(
        eq(article.projectId, validToken.projectId),
        eq(article.status, "published"),
        eq(article.id, params.articleId)
      ),
    columns: {
      id: true,
      title: true,
      description: true,
      slug: true,
      image: true,
      publishedAt: true,
      authorName: true,
    },
    with: {
      html: {
        orderBy: (html, { desc }) => [desc(html.createdAt)],
        limit: 1,
      },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...article,
    html: article.html[0]?.html,
  });
}
