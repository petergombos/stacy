import { Button } from "@/components/ui/button";
import { Project } from "@/lib/db/schema";
import { Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { ProjectCreateDialog } from "./project-create-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ProjectListProps {
  projects: (Project & { articleCount: number })[];
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
      <div className="grid gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.shortDescription}
                </p>
                <div className="flex justify-start items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {project.articleCount || 0} Articles
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
