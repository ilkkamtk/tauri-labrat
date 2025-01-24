import React, { useEffect, useRef } from 'react';

import Camera from '@/components/Camera';
import { useFaceDetection } from '@/hooks/FaceHooks';
import { useNavigate } from 'react-router';
import { useDbContext } from '@/hooks/ContextHooks';

const DetectFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const { detection, getDescriptors, matchFace } = useFaceDetection();
  const navigate = useNavigate();
  const { state, faces } = useDbContext();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    // Detect face from video frames
    const detectFace = async (faces: Float32Array[]) => {
      try {
        const descriptorsResult = await getDescriptors(videoRef);
        if (descriptorsResult) {
          console.log('faces in DetectFace:', faces);
          // Case 1: No faces in database - navigate to save the first face
          if (faces.length === 0) {
            console.log('No faces in database, navigating to save first face');
            navigate('/detected', {
              state: descriptorsResult.labeledDescriptor.toJSON(),
            });
            return;
          }

          // Case 2: Check if face matches any existing face
          const match = await matchFace(
            descriptorsResult.result.descriptor,
            faces,
          );
          console.log('match result:', match);

          // If match.distance > 0.3, it means the face is not recognized (new face)
          if (match && match.distance > 0.3) {
            console.log('New face detected, navigating to save');
            navigate('/detected', {
              state: descriptorsResult.labeledDescriptor.toJSON(),
            });
            return;
          }
        }
      } catch (error) {
        console.error('Error detecting face:', error);
      }

      timer = setTimeout(detectFace, 100, faces);
    };

    const startDetection = async () => {
      try {
        if (videoRef.current && state.status === 'ready' && faces.length >= 0) {
          await new Promise<void>((resolve) => {
            if (videoRef.current!.readyState >= 2) {
              resolve();
            } else {
              videoRef.current!.oncanplay = () => resolve();
            }
          });

          console.log('Starting detection with faces:', faces);
          detectFace(faces);
        }
      } catch (error) {
        console.error('Error initializing video feed:', error);
      }
    };

    startDetection();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [state.status, faces, navigate, getDescriptors, matchFace]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Face Detection</h1>
      <div style={{ position: 'relative' }}>
        <Camera ref={videoRef} width={800} aspect={16 / 9} />
        {detection && (
          <div
            style={{
              position: 'absolute',
              top: detection.box.y,
              left: detection.box.x,
              width: detection.box.width,
              height: detection.box.height,
              border: '2px solid red',
              pointerEvents: 'none',
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default DetectFace;
