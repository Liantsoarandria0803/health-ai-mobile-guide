import { useState, useEffect } from 'react';
import { ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HistoricalPageProps {
  userData: any;
  onBack: () => void;
  onItemClick: (historyItem: any) => void;
}

interface HistoryItem {
  id: number;
  diagnostic: {
    id: number;
    maladie: string;
    confiance: number;
    dateCreation: string;
    photo: string;
  };
  recommandation: {
    id: number;
    contenu: string;
  };
}

const HistoricalPage = ({ userData, onBack, onItemClick }: HistoricalPageProps) => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get userID from the updated data structure
    const userId = userData?.userID;
    console.log('User data in HistoricalPage:', userData);
    console.log('User ID for historical data:', userId);
    
    if (userId) {
      fetchHistoricalData(userId);
    } else {
      console.error('No userID found in userData');
      setIsLoading(false);
    }
  }, [userData]);

  const fetchHistoricalData = async (userId: number) => {
    try {
      console.log(`Fetching historical data for user ID: ${userId}`);
      const response = await fetch(`http://localhost:8080/historique/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }

      const result = await response.json();
      console.log('Historical data:', result);
      
      if (result.status === 'success') {
        setHistoryData(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch historical data');
      }

    } catch (error) {
      console.error('Historical data error:', error);
      toast.error('Failed to load historical data');
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDiseaseName = (maladie: string) => {
    if (maladie.includes('healthy')) {
      return 'healthy plant';
    }
    if (maladie.includes('Early_blight')) {
      return 'Early blight';
    }
    if (maladie.includes('Late_blight')) {
      return 'Late blight';
    }
    return maladie.replace('Potato___', '').replace('_', ' ');
  };

  const getIconColor = (maladie: string) => {
    if (maladie.includes('healthy')) {
      return 'bg-green-700';
    }
    return 'bg-orange-500';
  };

  const getIcon = (maladie: string) => {
    if (maladie.includes('healthy')) {
      return <Leaf className="w-6 h-6 text-white" />;
    }
    return (
      <div className="w-6 h-6 flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading historical data...</div>
      </div>
    );
  }

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

      {/* Title */}
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Historical</h1>
      </div>

      {/* Historical List */}
      <div className="flex-1 px-6 pb-20">
        {historyData.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
            No historical data found
          </div>
        ) : (
          <div className="space-y-4">
            {historyData.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-orange-100 transition-colors text-left"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(item.diagnostic.maladie)}`}>
                  {getIcon(item.diagnostic.maladie)}
                </div>
                <div className="flex-1">
                  <div className="text-gray-800 font-medium">
                    {formatDiseaseName(item.diagnostic.maladie)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.diagnostic.dateCreation).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with User Email */}
      <div className="bg-orange-400 p-6 text-center">
        <div className="text-lg font-semibold text-gray-800">
          {userData?.email || 'User'}
        </div>
      </div>
    </div>
  );
};

export default HistoricalPage;
