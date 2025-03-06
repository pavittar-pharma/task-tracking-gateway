
import { LoginForm } from "@/components/auth/LoginForm";
import { Container } from "@/components/ui/container";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Container className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pharma-700 to-pharma-500">
              PharmaSync
            </h2>
          </Link>
        </div>
        
        <div className="mt-8">
          <LoginForm />
        </div>
        
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-pharma-600 hover:text-pharma-500 dark:text-pharma-400 dark:hover:text-pharma-300"
          >
            &larr; Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Login;
