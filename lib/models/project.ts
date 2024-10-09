import { db } from "@/lib/db";
import { NewProject, projects } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";

export const getProjects = async () => {
  const items = await db.query.projects.findMany({
    orderBy: desc(projects.createdAt),
  });
  return items;
};

export const getProject = async (projectId: string) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
  return project;
};

export const createProject = async (project: Omit<NewProject, "id">) => {
  const id = generateIdFromEntropySize(10);
  const [newProject] = await db
    .insert(projects)
    .values({
      ...project,
      id,
    })
    .returning();
  return newProject;
};

export const updateProject = async (
  projectId: string,
  project: Partial<Omit<NewProject, "id">>
) => {
  const [updatedProject] = await db
    .update(projects)
    .set(project)
    .where(eq(projects.id, projectId))
    .returning();
  return updatedProject;
};

export const deleteProject = async (projectId: string) => {
  await db.delete(projects).where(eq(projects.id, projectId));
};

export const getProjectsWithArticleCount = async () => {
  const projectsWithCount = await db.query.projects.findMany({
    orderBy: desc(projects.createdAt),
    with: {
      articles: {
        columns: {
          id: true,
        },
      },
    },
  });

  return projectsWithCount.map((project) => ({
    ...project,
    articleCount: project.articles.length,
  }));
};

export const getProjectBySlug = async (slug: string) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, slug),
  });
  return project;
};
