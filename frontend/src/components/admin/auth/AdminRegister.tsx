import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import { Button } from '../../ui/Button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/Card';
import { FormInput } from '../../ui/FormInput';

export interface AdminRegisterActionData {
  error?: string;
  fieldErrors?: {
    username?: string;
    password?: string;
    passwordConfirm?: string;
  };
}

export const AdminRegister = () => {
  const actionData = useActionData() as AdminRegisterActionData | undefined;
  const navigation = useNavigation();

  const isBusy = navigation.state !== 'idle';

  return (
    <main className="min-h-screen bg-surface-page flex items-center justify-center p-4 font-poppins">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className='text-xl'>Register Admin Account</CardTitle>
          <CardDescription>
            Create credentials to access the store dashboard
          </CardDescription>
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
            minLength={3}
            autoComplete="username"
            disabled={isBusy}
            placeholder="Choose a username"
            error={actionData?.fieldErrors?.username}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            disabled={isBusy}
            placeholder="Create a strong password"
            error={actionData?.fieldErrors?.password}
          />

          <FormInput
            label="Repeat password"
            name="passwordConfirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            disabled={isBusy}
            placeholder="Repeat your password"
            error={actionData?.fieldErrors?.passwordConfirm}
          />

          <Button type="submit" fullWidth isLoading={isBusy}>
            Create account
          </Button>
        </Form>

        <CardFooter className="text-center">
          Already have an admin account?{' '}
          <Link
            to="/admin/login"
            className="font-medium text-brand hover:text-brand-hover underline-offset-4 hover:underline transition"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};

export default AdminRegister;