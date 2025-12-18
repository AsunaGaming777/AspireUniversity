"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@aspire/ui";

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role);
    }
  }, [session]);

  const testAdminAccess = async () => {
    try {
      const response = await fetch("/api/admin/test");
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Admin access granted! Role: ${data.user.role}`);
      } else {
        setTestResult(`❌ Access denied: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const testRoleChange = async () => {
    if (!session?.user?.id) return;
    
    try {
      // This would require admin privileges in real usage
      const response = await fetch(`/api/admin/users/${session.user.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "mentor" }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Role change successful: ${data.message}`);
        // Refresh session to get updated role
        window.location.reload();
      } else {
        setTestResult(`❌ Role change failed: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication & RBAC Test Page</h1>
      
      {!session ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sign In Required</h2>
          <p className="text-gray-600">
            Please sign in to test authentication and role-based access control.
          </p>
          <div className="space-x-4">
            <Button onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
            <Button onClick={() => signIn("discord")}>
              Sign in with Discord
            </Button>
            <Button onClick={() => signIn("github")}>
              Sign in with GitHub
            </Button>
          </div>
          <div className="mt-4">
            <a 
              href="/auth/signin" 
              className="text-gold hover:text-gold-700 underline"
            >
              Or use email/password
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Session</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Name:</strong> {session.user?.name}</p>
              <p><strong>Role:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userRole}</span></p>
              <p><strong>User ID:</strong> <span className="font-mono text-sm">{session.user?.id}</span></p>
            </div>
            <div className="mt-4">
              <Button onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">RBAC Tests</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Admin Access Test</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Test if you can access admin-only endpoints.
                </p>
                <Button onClick={testAdminAccess} variant="outline">
                  Test Admin Access
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Role Change Test</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Test role change functionality (requires admin privileges).
                </p>
                <Button onClick={testRoleChange} variant="outline">
                  Test Role Change
                </Button>
              </div>
            </div>
            
            {testResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="font-mono text-sm">{testResult}</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Navigation Tests</h2>
            <div className="space-y-2">
              <a 
                href="/admin" 
                className="block text-gold hover:text-gold-700 underline"
              >
                → Admin Dashboard (requires admin role)
              </a>
              <a 
                href="/" 
                className="block text-gold hover:text-gold-700 underline"
              >
                → Home Page
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@aspire/ui";

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role);
    }
  }, [session]);

  const testAdminAccess = async () => {
    try {
      const response = await fetch("/api/admin/test");
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Admin access granted! Role: ${data.user.role}`);
      } else {
        setTestResult(`❌ Access denied: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const testRoleChange = async () => {
    if (!session?.user?.id) return;
    
    try {
      // This would require admin privileges in real usage
      const response = await fetch(`/api/admin/users/${session.user.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "mentor" }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Role change successful: ${data.message}`);
        // Refresh session to get updated role
        window.location.reload();
      } else {
        setTestResult(`❌ Role change failed: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication & RBAC Test Page</h1>
      
      {!session ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sign In Required</h2>
          <p className="text-gray-600">
            Please sign in to test authentication and role-based access control.
          </p>
          <div className="space-x-4">
            <Button onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
            <Button onClick={() => signIn("discord")}>
              Sign in with Discord
            </Button>
            <Button onClick={() => signIn("github")}>
              Sign in with GitHub
            </Button>
          </div>
          <div className="mt-4">
            <a 
              href="/auth/signin" 
              className="text-gold hover:text-gold-700 underline"
            >
              Or use email/password
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Session</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Name:</strong> {session.user?.name}</p>
              <p><strong>Role:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userRole}</span></p>
              <p><strong>User ID:</strong> <span className="font-mono text-sm">{session.user?.id}</span></p>
            </div>
            <div className="mt-4">
              <Button onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">RBAC Tests</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Admin Access Test</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Test if you can access admin-only endpoints.
                </p>
                <Button onClick={testAdminAccess} variant="outline">
                  Test Admin Access
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Role Change Test</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Test role change functionality (requires admin privileges).
                </p>
                <Button onClick={testRoleChange} variant="outline">
                  Test Role Change
                </Button>
              </div>
            </div>
            
            {testResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="font-mono text-sm">{testResult}</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Navigation Tests</h2>
            <div className="space-y-2">
              <a 
                href="/admin" 
                className="block text-gold hover:text-gold-700 underline"
              >
                → Admin Dashboard (requires admin role)
              </a>
              <a 
                href="/" 
                className="block text-gold hover:text-gold-700 underline"
              >
                → Home Page
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


