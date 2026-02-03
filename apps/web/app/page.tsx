import ImportsTab from "@/features/imports/components/imports-tab";

export default function Home() {
  // Default project ID for demo purposes
  const projectId = "demo-project";
  const entityType = "CONTACTS";

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Holded Importer</h1>
          <p className="text-muted-foreground mt-2">Manage your data imports efficiently</p>
        </div>
        <ImportsTab projectId={projectId} entityType={entityType} />
      </div>
    </main>
  );
}
