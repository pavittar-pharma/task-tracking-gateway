
import { LoginForm } from "@/components/auth/LoginForm";
import { Container } from "@/components/ui/container";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Container className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Pavittar Pharma CRM
            </h2>
          </Link>
        </div>
        
        <div className="mt-8">
          <LoginForm />
        </div>
        
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            &larr; Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Login;
