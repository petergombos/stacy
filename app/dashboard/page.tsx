import CreateArticleButton from "@/components/CreateArticleButton";
import { getArticles } from "@/lib/models/article";
import Link from "next/link";

export default async function DashboardPage() {
  const allArticles = await getArticles();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Articles Dashboard</h1>
      <CreateArticleButton />
      <ul className="mt-4 space-y-2">
        {allArticles.map((article) => (
          <li key={article.id} className="border p-4 rounded-md">
            <Link
              href={`/editor/${article.id}`}
              className="text-blue-600 hover:underline"
            >
              <h2 className="text-xl font-semibold">
                {article.title || "Untitled"}
              </h2>
            </Link>
            <p>Status: {article.status}</p>
            <p>
              Published:{" "}
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleString()
                : "Not published"}
            </p>
            {article.updatedAt && (
              <p>
                Last Updated: {new Date(article.updatedAt).toLocaleString()}
              </p>
            )}
            <p>Author: {article.authorName || "Unknown"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
