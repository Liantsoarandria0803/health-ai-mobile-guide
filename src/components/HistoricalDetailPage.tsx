
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './logo';

interface HistoricalDetailPageProps {
  historyItem: any;
  onBack: () => void;
  onHome: () => void;
}

const HistoricalDetailPage = ({ historyItem, onBack, onHome }: HistoricalDetailPageProps) => {
  const formatDiseaseName = (nomMaladie: string) => {
    if (nomMaladie.includes('healthy')) {
      return 'Healthy Plant';
    }
    if (nomMaladie.includes('Early_blight')) {
      return 'Early Blight';
    }
    if (nomMaladie.includes('Late_blight')) {
      return 'Late Blight';
    }
    return nomMaladie.replace('Potato___', '').replace('_', ' ');
  };

  const getRecommendations = () => {
    if (!historyItem?.texte) {
      return ['No recommendations available'];
    }
    
    // Split recommendations by line breaks and filter out empty lines
    return historyItem.texte
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.trim());
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-12">
        <button 
          onClick={onBack}
          className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div className="w-6 h-6 text-orange-500">
          <div className="w-full h-full border-2 border-orange-500 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 pb-8">
        {/* Logo */}
        <div className="w-32 h-32 mb-6">
          <Logo />
        </div>

        {/* Disease Name */}
        <div className="w-full max-w-sm mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 capitalize">
            {formatDiseaseName(historyItem.nomMaladie)}
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Confidence: {Math.round(historyItem.scoreProbabilite * 100)}%
          </p>
          <p className="text-center text-gray-500 text-sm mt-1">
            {new Date(historyItem.dateDiagnostic).toLocaleDateString()}
          </p>
        </div>

        {/* Recommendations Section */}
        <div className="w-full max-w-sm">
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

export default HistoricalDetailPage;
