
import React from 'react';

interface SkeletonProps {
  aspectRatio?: '16:9' | '1:1' | '4:5';
}

const ProductSkeleton: React.FC<SkeletonProps> = ({ aspectRatio = '4:5' }) => {
  const ratioClass = aspectRatio === '16:9' ? 'aspect-video' : aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[4/5]';
  
  return (
    <div className="flex flex-col animate-pulse">
      <div className={`relative ${ratioClass} bg-gray-200 rounded-[2rem] mb-8 border border-gray-50 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
      
      <div className="px-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded-full w-1/3"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
