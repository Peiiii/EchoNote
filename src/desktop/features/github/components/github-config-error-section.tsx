import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';

interface GitHubConfigErrorSectionProps {
  configErrors: string[];
}

export function GitHubConfigErrorSection({ configErrors }: GitHubConfigErrorSectionProps) {
  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-600">⚠️ GitHub Configuration Incomplete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Please complete GitHub configuration first to use integration features:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
            {configErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Configuration Steps:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Register OAuth app on GitHub</li>
              <li>Create .env.local file</li>
              <li>Configure environment variables</li>
              <li>Restart application</li>
            </ol>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            For detailed configuration instructions, see <code>docs/github-setup.md</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
