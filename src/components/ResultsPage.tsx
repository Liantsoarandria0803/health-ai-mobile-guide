
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsPageProps {
  disease: string;
  confidence: number;
  recommendations: string[];
  selectedFile: File | null;
  onHome: () => void;
}

const ResultsPage = ({ disease, confidence, recommendations, selectedFile, onHome }: ResultsPageProps) => {
  const imageUrl = selectedFile ? URL.createObjectURL(selectedFile) : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-12">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-full"></div>
        </div>
        <ArrowRight className="w-6 h-6 text-orange-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 pb-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-amber-900 rounded-t-full relative mx-auto mb-3">
            <div className="absolute inset-3 bg-orange-200 rounded-t-full">
              <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
              <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
              <div className="absolute top-6 left-3 w-1 h-1 bg-amber-900 rounded-full"></div>
              <div className="absolute top-7 right-3 w-1 h-1 bg-amber-900 rounded-full"></div>
              <div className="absolute bottom-4 left-6 w-1 h-1 bg-amber-900 rounded-full"></div>
              <div className="absolute bottom-5 right-6 w-1 h-1 bg-amber-900 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-lg font-light text-gray-400 text-center tracking-wider">
            POTATO GUARD
          </h1>
        </div>

        {/* Image Display */}
        {imageUrl && (
          <div className="w-full max-w-sm mb-6">
            <div className="relative rounded-2xl overflow-hidden border-4 border-orange-400">
              <img 
                src={imageUrl} 
                alt="Analyzed crop" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        )}

        {/* Result */}
        <div className="w-full max-w-sm mb-6">
          <div className="bg-green-200 rounded-2xl p-4 text-center">
            <h2 className="text-xl font-semibold text-green-800 mb-2 capitalize">
              {disease}
            </h2>
            <p className="text-orange-600 font-medium">
              Confidence: <span className="font-bold">{confidence}%</span>
            </p>
          </div>
        </div>

        {/* See Recommendation Button */}
        <div className="w-full max-w-sm mb-8">
          <Button
            onClick={() => {
              // Scroll to recommendations section
              const recommendationsElement = document.getElementById('recommendations');
              if (recommendationsElement) {
                recommendationsElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full bg-green-800 hover:bg-green-900 text-orange-200 py-4 rounded-full text-lg font-medium"
          >
            See recommendation
          </Button>
        </div>

        {/* Recommendations Section */}
        <div id="recommendations" className="w-full max-w-sm">
          <h3 className="text-xl font-semibold text-orange-600 mb-4 text-center">
            Recommendations
          </h3>
          <div className="space-y-3 mb-8">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="text-gray-600">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                {recommendation}
              </div>
            ))}
          </div>

          {/* Home Button */}
          <Button
            onClick={onHome}
            className="w-full bg-green-800 hover:bg-green-900 text-orange-200 py-4 rounded-full text-lg font-medium"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
