import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type CameraProps = {
  width: number;
  aspect: number;
};

const Camera = forwardRef<HTMLVideoElement, CameraProps>((props, ref) => {
  const { width, aspect } = props;
  const height = width / aspect;
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element

  // jaetaan videoRef parentille
  useImperativeHandle(ref, () => videoRef.current!);

  useEffect(() => {
    const setupVideoInput = async () => {
      // getUserMedia
      videoRef.current?.srcObject = stream;
    };
    setupVideoInput();
  }, []);

  return <video ref={videoRef} width={width} height={height} />;
});

export default Camera;
