import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import {Button} from "../../ui/Button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/Card';
import { FormInput } from '../../ui/FormInput';

export interface AdminLoginActionData {
  error?: string;
}

export const AdminLogin = () => {
  const actionData = useActionData() as AdminLoginActionData | undefined;
  const navigation = useNavigation();

  const isBusy = navigation.state !== 'idle';

  return (
    <main className="min-h-screen bg-surface-page flex items-center justify-center p-4 font-plus-font">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Admin Portal</CardTitle>
          <CardDescription>Sign in to manage your store</CardDescription>
        </CardHeader>

        {actionData?.error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
          >
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-5">
          <FormInput
            label="Username"
            name="username"
            type="text"
            required
            autoComplete="username"
            disabled={isBusy}
            placeholder="Enter your username"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            disabled={isBusy}
            placeholder="••••••••"
          />

          <Button type="submit" fullWidth isLoading={isBusy}>
            Sign in
          </Button>
        </Form>

        <CardFooter className="text-center">
          Don&apos;t have an admin account?{' '}
          <Link
            to="/admin/register"
            className="font-medium text-brand hover:text-brand-hover underline-offset-4 hover:underline transition"
          >
            Register an account
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};