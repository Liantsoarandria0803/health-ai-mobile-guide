
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './logo';
interface ResultsPageProps {
  disease: string;
  confidence: number;
  recommendations: string[];
  selectedFile: File | null;
  onHome: () => void;
}

const ResultsPage = ({ disease, confidence, recommendations, selectedFile, onHome }: ResultsPageProps) => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const imageUrl = selectedFile ? URL.createObjectURL(selectedFile) : '';

  const handleSeeRecommendation = () => {
    setShowRecommendations(true);
    // Scroll to recommendations section
    setTimeout(() => {
      const recommendationsElement = document.getElementById('recommendations');
      if (recommendationsElement) {
        recommendationsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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
      <div className="w-32 h-32 mb-6">
        <Logo />
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
              {disease.replace('Potato___', '').replace('_', ' ')}
            </h2>
            <p className="text-orange-600 font-medium">
              Confidence: <span className="font-bold">{confidence}%</span>
            </p>
          </div>
        </div>

        {/* See Recommendation Button */}
        {!showRecommendations && (
          <div className="w-full max-w-sm mb-8">
            <Button
              onClick={handleSeeRecommendation}
              className="w-full bg-green-800 hover:bg-green-900 text-orange-200 py-4 rounded-full text-lg font-medium"
            >
              See recommendation
            </Button>
          </div>
        )}

        {/* Recommendations Section - Only show when button is clicked */}
        {showRecommendations && (
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
        )}

        {/* Home Button - Show when recommendations are not visible */}
        {!showRecommendations && (
          <div className="w-full max-w-sm">
            <Button
              onClick={onHome}
              className="w-full bg-green-800 hover:bg-green-900 text-orange-200 py-4 rounded-full text-lg font-medium"
            >
              Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
