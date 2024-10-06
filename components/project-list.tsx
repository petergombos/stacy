import { Button } from "@/components/ui/button";
import { Project } from "@/lib/db/schema";
import Link from "next/link";
import { ProjectCreateDialog } from "./project-create-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <ProjectCreateDialog>
          <Button variant="outline">Create Project</Button>
        </ProjectCreateDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {project.shortDescription}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
