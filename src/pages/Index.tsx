
import { QuoteBuilder } from "@/components/QuoteBuilder";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Instant Quote Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Place an order or generate your custom quote (no personal details required).
          </p>
        </div>
        <QuoteBuilder />
      </div>
    </div>
  );
};

export default Index;
