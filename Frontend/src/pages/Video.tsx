import "./index.css"
import { useEffect, useMemo } from 'react';
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  StreamTheme,
  ParticipantView,
} from '@stream-io/video-react-sdk';
import type { StreamVideoParticipant, User } from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';

// === Config ===
const apiKey = 'mmhfdzb5evj2';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL1NpbXBsZV9QaXBlciIsInVzZXJfaWQiOiJTaW1wbGVfUGlwZXIiLCJ2YWxpZGl0eV9pbl9zZWNvbmRzIjo2MDQ4MDAsImlhdCI6MTc1ODMzNTU4MSwiZXhwIjoxNzU4OTQwMzgxfQ.11QjzKaFwB3YlchVMAmJnAcL3k2VH-KY3cgqnPKpOMs';
const userId = 'Simple_Piper';
const callId = 'dprUkQlGtcH86ey8zYe2o';

const user: User = {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

export default function VideoCall() {
  // Create the client
  const client = useMemo(() => new StreamVideoClient({ apiKey, user, token }), []);

  // Create a call instance
  const call = useMemo(() => client.call('default', callId), [client]);

  // Join call when component mounts
  useEffect(() => {
    const joinCall = async () => {
      await call.join({ create: true });
    };
    joinCall();

    return () => {
      call.leave();
    };
  }, [call]);

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}

// === Layout Components ===
const MyUILayout = () => {
  const { useCallCallingState, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <MyParticipantList participants={remoteParticipants} />
        <MyFloatingLocalParticipant participant={localParticipant} />
      </div>
    </StreamTheme>
  );
};

const MyParticipantList = ({ participants }: { participants: StreamVideoParticipant[] }) => {
  if (participants.length === 0) {
    return <p>No other participants yet...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      {participants.map((participant) => (
        <ParticipantView participant={participant} key={participant.sessionId} />
      ))}
    </div>
  );
};

const MyFloatingLocalParticipant = ({ participant }: { participant?: StreamVideoParticipant }) => {
  if (!participant) {
    return <p>Error: No local participant</p>;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <ParticipantView participant={participant} />
    </div>
  );
};
