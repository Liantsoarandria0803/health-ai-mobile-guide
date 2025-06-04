import { useState } from 'react';
import { Camera, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AnalysisPage from '@/components/AnalysisPage';
import ResultsPage from '@/components/ResultsPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'analysis' | 'results'>('home');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCurrentPage('analysis');
    analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://liantsoaxx08-potatoguardapi.hf.space/predict/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      // Correctly map the API response
      setAnalysisResult(result.predicted_class || '');
      setConfidence(Math.round((result.confidence || 0) * 100));

      // Get recommendations
      await getRecommendations(result.predicted_class);
      
      setTimeout(() => {
        setCurrentPage('results');
      }, 2000);

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze the image. Please try again.');
    }
  };

  const getRecommendations = async (disease: string) => {
    try {
      const response = await fetch(`https://liantsoaxx08-potatoguardapi.hf.space/recommendation?disease=${encodeURIComponent(disease)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const result = await response.json();
      console.log('Recommendations Response:', result);
      
      let extractedRecommendations: string[] = [];

      // Handle different response formats
      if (result.recommandations && Array.isArray(result.recommandations)) {
        // Handle format with "recommandations" array
        extractedRecommendations = result.recommandations.map((rec: any) => {
          // Try different property names
          return rec.description || rec.action || '';
        }).filter((desc: string) => desc.length > 0);
      } else if (result.recommandations_mildiou_precoce && Array.isArray(result.recommandations_mildiou_precoce)) {
        // Handle format with "recommandations_mildiou_precoce" array
        extractedRecommendations = result.recommandations_mildiou_precoce.map((rec: any) => {
          return rec.description || rec.action || '';
        }).filter((desc: string) => desc.length > 0);
      }

      if (extractedRecommendations.length > 0) {
        setRecommendations(extractedRecommendations);
      } else {
        setRecommendations(['Unable to fetch recommendations at this time']);
      }
      
    } catch (error) {
      console.error('Recommendations error:', error);
      setRecommendations(['Unable to fetch recommendations at this time']);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  const handleImageImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  const resetToHome = () => {
    setCurrentPage('home');
    setSelectedFile(null);
    setAnalysisResult('');
    setConfidence(0);
    setRecommendations([]);
  };

  if (currentPage === 'analysis') {
    return (
      <AnalysisPage 
        selectedFile={selectedFile}
        onBack={resetToHome}
      />
    );
  }

  if (currentPage === 'results') {
    return (
      <ResultsPage
        disease={analysisResult}
        confidence={confidence}
        recommendations={recommendations}
        selectedFile={selectedFile}
        onHome={resetToHome}
      />
    );
  }

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
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="mb-16">
          <div className="w-32 h-32 bg-amber-900 rounded-t-full relative mx-auto mb-4">
            <div className="absolute inset-4 bg-orange-200 rounded-t-full">
              <div className="absolute top-4 left-6 w-2 h-2 bg-amber-900 rounded-full"></div>
              <div className="absolute top-6 right-6 w-2 h-2 bg-amber-900 rounded-full"></div>
              <div className="absolute top-8 left-4 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
              <div className="absolute top-10 right-4 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-2xl font-light text-gray-400 text-center tracking-wider">
            POTATO GUARD
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Button
            onClick={handleCameraCapture}
            className="w-full bg-green-800 hover:bg-green-900 text-orange-200 py-6 rounded-full text-lg font-medium flex items-center justify-center gap-3"
          >
            <Camera className="w-6 h-6" />
            Take a crop picture
          </Button>

          <Button
            onClick={handleImageImport}
            className="w-full bg-green-800 hover:bg-green-900 text-orange-200 py-6 rounded-full text-lg font-medium flex items-center justify-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Import a crop picture
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
