import { db } from "@/lib/db";
import { NewProject, projects } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";

export const getProjects = async ({ userId }: { userId?: string } = {}) => {
  const items = await db.query.projects.findMany({
    orderBy: desc(projects.createdAt),
    where: userId ? eq(projects.userId, userId) : undefined,
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

export const getProjectsWithArticleCount = async ({
  userId,
}: {
  userId?: string;
} = {}) => {
  const projectsWithCount = await db.query.projects.findMany({
    orderBy: desc(projects.createdAt),
    where: userId ? eq(projects.userId, userId) : undefined,
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

export const requireProjectAccess = async (
  projectId: string,
  userId: string
) => {
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
  });

  if (!project) {
    throw new Error("Project not found");
  }
};
