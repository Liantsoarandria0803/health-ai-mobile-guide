import { useState, useEffect } from 'react';
import { Camera, Plus, ArrowRight, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AnalysisPage from '@/components/AnalysisPage';
import ResultsPage from '@/components/ResultsPage';
import LoginPage from '@/components/LoginPage';
import RegisterPage from '@/components/RegisterPage';
import HistoricalPage from '@/components/HistoricalPage';
import HistoricalDetailPage from '@/components/HistoricalDetailPage';
import UserMenu from '@/components/UserMenu';
import Logo from '@/components/logo';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'analysis' | 'results' | 'login' | 'register' | 'historical' | 'historical-detail'>('home');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [diagnosticId, setDiagnosticId] = useState<number | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (!userData) {
      toast.error('Please login first to analyze images');
      setCurrentPage('login');
      return;
    }
    
    setSelectedFile(file);
    setCurrentPage('analysis');
    analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/predict/', {
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
      setDiagnosticId(result.diagnostic_id);

      // Get recommendations
      await getRecommendations(result.predicted_class, result.diagnostic_id);
      
      setTimeout(() => {
        setCurrentPage('results');
      }, 2000);

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze the image. Please try again.');
    }
  };

  const getRecommendations = async (disease: string, diagnosticId: number) => {
    try {
      // Get user ID from the updated data structure
      const userId = userData.user_id || userData.user?.id;
      console.log('User ID for recommendations:', userId);
      
      const response = await fetch(`http://localhost:8080/recommendation?disease=${encodeURIComponent(disease)}&diagnostic_id=${diagnosticId}&user_id=${userId}`);
      
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
      } else if (result.recommandations_milibou && Array.isArray(result.recommandations_milibou)) {
        // Handle format with "recommandations_milibou" array (from backend code)
        extractedRecommendations = result.recommandations_milibou.map((rec: any) => {
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

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '1000';

      const canvas = document.createElement('canvas');
      const captureButton = document.createElement('button');
      captureButton.textContent = 'Capture';
      captureButton.style.position = 'absolute';
      captureButton.style.color = '#fff';
      captureButton.style.left = '50%';
      captureButton.style.transform = 'translateX(-50%)';
      captureButton.style.bottom = '20px';
      captureButton.style.padding = '10px 20px';
      captureButton.style.backgroundColor = 'green';
      captureButton.style.border = 'none';
      captureButton.style.borderRadius = '5px';
      captureButton.style.cursor = 'pointer';

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.color = '#fff';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '20px';
      closeButton.style.right = '20px';
      closeButton.style.padding = '10px 20px';
      closeButton.style.backgroundColor = 'red';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '5px';
      closeButton.style.cursor = 'pointer';

      modal.appendChild(video);
      modal.appendChild(captureButton);
      modal.appendChild(closeButton);
      document.body.appendChild(modal);

      captureButton.onclick = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
              handleFileSelect(file);
            }
          }, 'image/jpeg');
        }
        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(modal);
      };

      closeButton.onclick = () => {
        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(modal);
      };
    } catch (error) {
      console.error('Camera capture error:', error);
      toast.error('Unable to access the camera. Please try again.');
    }
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
    setDiagnosticId(null);
    setSelectedHistoryItem(null);
  };

  const handleLoginSuccess = (data: any) => {
    setUserData(data);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUserData(null);
    resetToHome();
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('login');
  };

  const handleHistoryItemClick = (historyItem: any) => {
    setSelectedHistoryItem(historyItem);
    setCurrentPage('historical-detail');
  };

  // Login Page
  if (currentPage === 'login') {
    return (
      <LoginPage 
        onBack={resetToHome}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setCurrentPage('register')}
      />
    );
  }

  // Register Page
  if (currentPage === 'register') {
    return (
      <RegisterPage 
        onBack={resetToHome}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setCurrentPage('login')}
      />
    );
  }

  // Historical Page
  if (currentPage === 'historical') {
    return (
      <HistoricalPage 
        userData={userData}
        onBack={resetToHome}
        onItemClick={handleHistoryItemClick}
      />
    );
  }

  // Historical Detail Page
  if (currentPage === 'historical-detail') {
    return (
      <HistoricalDetailPage 
        historyItem={selectedHistoryItem}
        onBack={() => setCurrentPage('historical')}
        onHome={resetToHome}
      />
    );
  }

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
        {userData ? (
          <UserMenu userData={userData} onLogout={handleLogout} />
        ) : (
          <button 
            onClick={() => setCurrentPage('login')}
            className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
          >
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </button>
        )}
        <ArrowRight className="w-6 h-6 text-orange-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Logo />

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

          {/* Historical Button - Only show for logged in users */}
          {userData && (
            <Button
              onClick={() => setCurrentPage('historical')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-full text-lg font-medium flex items-center justify-center gap-3"
            >
              <History className="w-6 h-6" />
              View Historical Data
            </Button>
          )}
        </div>

        {/* Login prompt for unauthenticated users */}
        {!userData && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Login to access all features</p>
            <Button
              onClick={() => setCurrentPage('login')}
              variant="outline"
              className="px-6 py-2 rounded-full"
            >
              Login / Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
