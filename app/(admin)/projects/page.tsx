import { Header } from "@/components/header";
import { ProjectList } from "@/components/project-list";
import { getProjects } from "@/lib/models/project";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <ProjectList projects={projects} />
      </main>
    </>
  );
}
