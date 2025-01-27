import Camera from '@/components/Camera';
import { useGestureRecognition } from '@/hooks/GestureHooks';
import { useRef } from 'react';

const DetectGesture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useGestureRecognition(videoRef);
  return (
    <>
      <section className="w-full">
        <Camera ref={videoRef} width={800} aspect={16 / 9} />
      </section>
    </>
  );
};

export default DetectGesture;
