import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const options = {
        host: 'www.bing.com',
        path: '/HPImageArchive.aspx?format=js&idx=0&n=1'
    };

    https.get(`https://${options.host}${options.path}`, (bingRes) => {
        let data = '';

        bingRes.on('data', (chunk) => {
            data += chunk;
        });

        bingRes.on('end', () => {
            res.status(200).json(JSON.parse(data));
        });

        bingRes.on('error', (err) => {
            res.status(500).json({ error: err.message });
        });
    });
};