
import { Container } from "@/components/ui/container";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 mt-auto py-12">
      <Container>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} PharmaSync CRM. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
