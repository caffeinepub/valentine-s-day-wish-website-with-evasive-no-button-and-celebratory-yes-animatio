import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginButton } from '../auth/LoginButton';
import { Lock } from 'lucide-react';

interface AccessRequiredCardProps {
  title?: string;
  description?: string;
  showLoginButton?: boolean;
}

export function AccessRequiredCard({
  title = 'Sign In Required',
  description = 'Please sign in to access this feature and save your personalization.',
  showLoginButton = true,
}: AccessRequiredCardProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {showLoginButton && (
        <CardContent>
          <LoginButton />
        </CardContent>
      )}
    </Card>
  );
}
