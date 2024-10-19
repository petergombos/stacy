import { Header } from "@/components/header";
import { ProjectList } from "@/components/project-list";
import { requireUser } from "@/lib/lucia/utils";
import { getProjectsWithArticleCount } from "@/lib/models/project";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { user } = await requireUser();
  const projects = await getProjectsWithArticleCount({ userId: user.id });

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto lg:px-8 px-4 py-6">
        <ProjectList projects={projects} />
      </main>
    </>
  );
}
