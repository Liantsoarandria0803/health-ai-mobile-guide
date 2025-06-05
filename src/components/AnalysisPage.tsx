
import { ArrowRight } from 'lucide-react';
import Logo from './logo';

interface AnalysisPageProps {
  selectedFile: File | null;
  onBack: () => void;
}

const AnalysisPage = ({ selectedFile, onBack }: AnalysisPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-12">
        <button onClick={onBack} className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-full"></div>
        </button>
        <ArrowRight className="w-6 h-6 text-orange-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        {/* <div className="mb-16">
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
        </div> */}
        <Logo />

        {/* Loading Spinner */}
        <div className="mb-8">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-orange-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>

        {/* Analysis Text */}
        <p className="text-xl text-orange-600 font-medium">
          Analysing photo ...
        </p>
      </div>
    </div>
  );
};

export default AnalysisPage;
