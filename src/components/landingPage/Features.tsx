
import { Container } from "@/components/ui/container";
import { Users, ShoppingCart, CheckSquare, BarChart3 } from "lucide-react";

const features = [
  {
    name: "Customer Management",
    description:
      "Efficiently manage customer information, track interactions, and maintain comprehensive profiles for better relationship management.",
    icon: Users,
  },
  {
    name: "Order & Inventory Tracking",
    description:
      "Keep tabs on your product inventory and track orders from placement to delivery, with automated low-stock alerts.",
    icon: ShoppingCart,
  },
  {
    name: "Task Management",
    description:
      "Assign tasks, set deadlines, and monitor progress with our color-coded task management system that keeps your team aligned.",
    icon: CheckSquare,
  },
  {
    name: "Performance Analytics",
    description:
      "Gain valuable insights into employee performance, sales metrics, and customer engagement with detailed analytics.",
    icon: BarChart3,
  },
];

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Streamline Your Pharmaceutical Business
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            PharmaSync CRM provides powerful tools designed specifically for pharmaceutical companies to efficiently manage customers, orders, and team performance.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="relative pl-16 transition duration-300 ease-in-out hover:translate-y-[-4px]"
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-pharma-600 text-white shadow-md">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </div>
  );
}
