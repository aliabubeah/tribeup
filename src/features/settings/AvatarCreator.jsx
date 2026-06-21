import { useEffect, useRef } from 'react';
// 1. Import the API function you just added to profile.js
import { updateAvatarUrlAPI } from '../../services/profile';
// 2. Import the AuthContext to get the user's logged-in token
import { useAuth } from '../../contexts/AuthContext'; 

// Replace this with your actual free Avaturn developer URL
const AVATURN_URL = 'https://tribeup.avaturn.dev'; 

export default function AvatarCreator() {
  const iframeRef = useRef(null);
  
  // 3. Extract the token from the AuthContext. 
  // (Note: If your frontend dev named the property 'userToken' or 'accessToken', change 'token' to match their naming)
  const { accessToken } = useAuth(); 

  useEffect(() => {
    const handleAvaturnMessage = async (event) => {

      // Security Check
      if (!event.origin.includes('avaturn.dev')) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        // When the user clicks "Save" inside the Avaturn iframe
        if (data.source === 'avaturn' && data.eventName === 'v2.avatar.exported') {
          const glbUrl = data.data.url;
          
          // 4. Execute the backend save operation right here!
          try {
             await updateAvatarUrlAPI(accessToken, glbUrl);
             console.log(glbUrl);
             alert("Avatar saved successfully! You can now enter the 3D rooms.");
             // Optional: If you want to redirect them automatically, your frontend dev can add routing here later.
          } catch (apiError) {
             console.error("Failed to save avatar to backend:", apiError);
          }
        }
      } catch (error) {
        console.error('Error parsing Avaturn message:', error);
      }
    };

    window.addEventListener('message', handleAvaturnMessage);
    return () => window.removeEventListener('message', handleAvaturnMessage);
  }, [accessToken]); // Re-run effect if token changes to keep it fresh

  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden border border-gray-300">
      <iframe
        ref={iframeRef}
        src={AVATURN_URL}
        title="Create your 3D Avatar"
        className="w-full h-full"
        allow="camera" 
      />
    </div>
  );
}
