interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-zinc-400">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}