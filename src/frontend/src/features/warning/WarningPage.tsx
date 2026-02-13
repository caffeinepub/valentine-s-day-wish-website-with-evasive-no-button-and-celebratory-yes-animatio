/**
 * @deprecated This warning page is no longer the default entry point.
 * The application now loads directly to the Valentine-themed landing page.
 * This file is kept for reference but is not actively used.
 */

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function WarningPage() {
  const [acknowledged, setAcknowledged] = useState(false);

  if (acknowledged) {
    return (
      <div className="warning-page-container">
        <div className="warning-content-wrapper">
          <Card className="warning-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
              <CardDescription className="text-lg">
                You have acknowledged the warning and entered the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                This is a placeholder for the main content area.
              </p>
            </CardContent>
          </Card>
        </div>
        <footer className="warning-footer">
          <p>
            Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'warning-app'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="warning-footer-link"
            >
              caffeine.ai
            </a>
          </p>
          <p className="warning-footer-year">© {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="warning-page-container">
      <div className="warning-content-wrapper">
        <Card className="warning-card">
          <CardHeader className="text-center space-y-6">
            <div className="warning-icon-wrapper">
              <AlertTriangle className="warning-icon" />
            </div>
            <CardTitle className="warning-title">
              ⚠️ WARNING ⚠️
            </CardTitle>
            <CardDescription className="warning-subtitle">
              OPEN AT YOUR OWN RISK
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="warning-text-content">
              <p className="warning-text">
                By proceeding, you acknowledge that you are entering at your own risk.
              </p>
              <p className="warning-text">
                The content beyond this point may contain material that is not suitable for all audiences.
              </p>
              <p className="warning-text">
                You assume full responsibility for any consequences that may arise from viewing this content.
              </p>
            </div>
            <div className="warning-actions">
              <Button
                onClick={() => setAcknowledged(true)}
                size="lg"
                className="warning-enter-button"
              >
                I Understand - Enter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <footer className="warning-footer">
        <p>
          Built with love using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'warning-app'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="warning-footer-link"
          >
            caffeine.ai
          </a>
        </p>
        <p className="warning-footer-year">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
