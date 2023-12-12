import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react';

import fs from 'fs';
import path from 'path';

const inter = Inter({ subsets: ['latin'] });

export default function Home({ data }: { data: { name: string }[] }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [speakerIndex, setSpeakerIndex] = useState<number>(-1);

  useEffect(() => {

    // Image
    (async () => {
      const response = await fetch('/api/image');
      const data = await response.json();
      const imageUrl = data.images[0].url;
      setImageUrl(`http://www.bing.com${imageUrl}`);
    })();

    // State
    setInterval(async () => {
      const response = await fetch('/api/state');
      const data = await response.json();
      setSpeakerIndex(data.speakerIndex);
    }, 500);
  }, []);

  const handleNext = async () => {
    const newState = {
      speakerIndex: Math.min(speakerIndex + 1, data.length - 1),
      running: true
    }
    setSpeakerIndex(newState.speakerIndex);

    await fetch('/api/state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newState),
    });
  };

  const handlePrevious = async () => {
    const newState = {
      speakerIndex: Math.max(speakerIndex - 1, 0),
      running: true
    }
    setSpeakerIndex(newState.speakerIndex);

    await fetch('/api/state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newState),
    });
  };

  const handleStart = async () => {
    const newState = {
      speakerIndex: 0,
      running: true
    }
    setSpeakerIndex(newState.speakerIndex);

    await fetch('/api/state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newState),
    });
  };

  const handleStop = async () => {
    const newState = {
      speakerIndex: -1,
      running: false
    }
    setSpeakerIndex(newState.speakerIndex);

    await fetch('/api/state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newState),
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${inter.className}`} style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPositionX: '50%' }}>
        <div style={{paddingTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <button style={{ padding: '10px 20px', fontSize: '20px' }} onClick={handleStart}>Start</button>
          <button style={{ padding: '10px 20px', fontSize: '20px' }} onClick={handlePrevious}>Previous</button>
          <button style={{ padding: '10px 20px', fontSize: '20px' }} onClick={handleNext}>Next</button>
          <button style={{ padding: '10px 20px', fontSize: '20px' }} onClick={handleStop}>Stop</button>
        </div>
        <div style={{ backgroundColor: 'rgb(40,40,40)', width: '50%', margin: 'auto' }}>
          {data.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'row',
              margin: '10px',
              padding: '10px',
              fontSize: '20px',
              backgroundColor: index === speakerIndex ? 'lightgreen' : 'transparent' // Change the background color here
            }}>
              {item.name}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'config.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data: { name: string }[] = JSON.parse(jsonData);

  return {
    props: {
      data
    }
  };
}