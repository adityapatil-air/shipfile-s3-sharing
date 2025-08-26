import React, { useState } from 'react';
import { SignIn, SignUp, useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Key, Cloud, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const OwnerAuth = () => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [awsCredentials, setAwsCredentials] = useState({
    accessKey: '',
    secretKey: '',
    region: 'us-east-1'
  });
  const [credentialsVerified, setCredentialsVerified] = useState(false);

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would verify AWS credentials
    // For demo purposes, we'll just simulate verification
    if (awsCredentials.accessKey && awsCredentials.secretKey) {
      setCredentialsVerified(true);
    }
  };

  if (isSignedIn && credentialsVerified) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-fit">
              <Cloud className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome, Owner!</CardTitle>
            <CardDescription>
              You're logged in as {user.primaryEmailAddress?.emailAddress}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AWS credentials verified. You have root access to ShipFile.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => signOut()}
              variant="outline" 
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSignedIn && !credentialsVerified) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex flex-col">
        <header className="border-b border-border bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </Link>
            </Button>
            <span className="text-lg font-semibold text-foreground">ShipFile</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-fit">
                <Key className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Verify AWS Credentials</CardTitle>
              <CardDescription>
                Prove ownership of your AWS S3 infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCredentialSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessKey">AWS Access Key ID</Label>
                  <Input
                    id="accessKey"
                    type="text"
                    value={awsCredentials.accessKey}
                    onChange={(e) => setAwsCredentials({...awsCredentials, accessKey: e.target.value})}
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretKey">AWS Secret Access Key</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={awsCredentials.secretKey}
                    onChange={(e) => setAwsCredentials({...awsCredentials, secretKey: e.target.value})}
                    placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">AWS Region</Label>
                  <Input
                    id="region"
                    type="text"
                    value={awsCredentials.region}
                    onChange={(e) => setAwsCredentials({...awsCredentials, region: e.target.value})}
                    placeholder="us-east-1"
                    required
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  Verify & Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary flex flex-col">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </Button>
          <span className="text-lg font-semibold text-foreground">ShipFile</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-fit">
              <Key className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Owner Authentication</CardTitle>
            <CardDescription>
              Sign in to verify your identity before providing AWS credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-4">
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-primary hover:opacity-90',
                      card: 'shadow-none',
                    },
                  }}
                  fallbackRedirectUrl="/owner-auth"
                  forceRedirectUrl="/owner-auth"
                />
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <SignUp 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-primary hover:opacity-90',
                      card: 'shadow-none',
                    },
                  }}
                  fallbackRedirectUrl="/owner-auth"
                  forceRedirectUrl="/owner-auth"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OwnerAuth;